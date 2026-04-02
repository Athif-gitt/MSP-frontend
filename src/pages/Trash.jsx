import React, { useDeferredValue, useMemo, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Navigate } from "react-router-dom";
import {
  AlertTriangle,
  CheckSquare,
  Loader2,
  RefreshCw,
  Search,
  Square,
  Trash2,
  Undo2,
} from "lucide-react";
import api from "../services/api";
import { useAuth } from "../context/AuthContext";
import {
  canDeleteTask,
  canRestoreTask,
  canViewTrash,
  getCurrentUserRole,
} from "../utils/permissions";
import { getOrgId } from "../utils/authStore";
import ConfirmModal from "../components/ConfirmModal";
import Toast from "../components/Toast";

const TRASH_QUERY_KEY = (orgId) => ["trash", "tasks", orgId];

function getTrashTimestamp(item) {
  return item.deleted_at || item.updated_at || item.created_at || null;
}

function formatDate(value) {
  if (!value) return "Unknown";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "Unknown";
  }

  return new Intl.DateTimeFormat(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
  }).format(date);
}

function getItemSubtitle(item) {
  const timestamp = getTrashTimestamp(item);
  const dueDate = item.due_date ? `Due ${formatDate(item.due_date)}` : "No due date";

  return timestamp
    ? `Moved to trash ${formatDate(timestamp)} • ${dueDate}`
    : dueDate;
}

const Trash = () => {
  const queryClient = useQueryClient();
  const { user } = useAuth();
  const currentOrgId = getOrgId();
  const userRole = getCurrentUserRole(user, currentOrgId);

  const [searchQuery, setSearchQuery] = useState("");
  const deferredSearchQuery = useDeferredValue(searchQuery);
  const [selectedIds, setSelectedIds] = useState([]);
  const [modalConfig, setModalConfig] = useState({
    isOpen: false,
    type: null,
    payload: null,
  });
  const [toastConfig, setToastConfig] = useState(null);

  const trashQueryKey = TRASH_QUERY_KEY(currentOrgId);
  const canRestore = canRestoreTask(userRole);
  const canDelete = canDeleteTask(userRole);
  const canEdit = canRestore || canDelete;

  const {
    data: trashedItems = [],
    isLoading,
    isError,
    error,
    refetch,
    isFetching,
  } = useQuery({
    queryKey: trashQueryKey,
    queryFn: async () => {
      const res = await api.get("/tasks/trash/");
      return res.data;
    },
    enabled: Boolean(currentOrgId),
  });

  const processedItems = useMemo(() => {
    const normalizedQuery = deferredSearchQuery.trim().toLowerCase();

    return [...trashedItems]
      .filter((item) => {
        if (!normalizedQuery) return true;

        return [item.title, item.description, item.project?.name, item.project?.public_id]
          .filter(Boolean)
          .some((value) => String(value).toLowerCase().includes(normalizedQuery));
      })
      .sort((a, b) => {
        const aTime = new Date(getTrashTimestamp(a) || 0).getTime();
        const bTime = new Date(getTrashTimestamp(b) || 0).getTime();
        return bTime - aTime;
      });
  }, [deferredSearchQuery, trashedItems]);

  const selectedCount = selectedIds.length;
  const allVisibleSelected =
    processedItems.length > 0 &&
    processedItems.every((item) => selectedIds.includes(item.id));

  const closeModal = () =>
    setModalConfig({ isOpen: false, type: null, payload: null });

  const openModal = (type, payload = null) =>
    setModalConfig({ isOpen: true, type, payload });

  const restoreMutation = useMutation({
    mutationFn: async (payload) => {
      if (Array.isArray(payload)) {
        return api.post("/tasks/bulk-restore/", { ids: payload });
      }

      return api.post(`/tasks/${payload}/restore/`);
    },
    onMutate: async (payload) => {
      await queryClient.cancelQueries({ queryKey: trashQueryKey });
      const previousTrash = queryClient.getQueryData(trashQueryKey) ?? [];
      const ids = Array.isArray(payload) ? payload : [payload];

      queryClient.setQueryData(trashQueryKey, (current = []) =>
        current.filter((item) => !ids.includes(item.id))
      );

      return { previousTrash };
    },
    onError: (_err, _payload, context) => {
      queryClient.setQueryData(trashQueryKey, context?.previousTrash ?? []);
      setToastConfig({ type: "error", message: "Failed to restore task." });
      closeModal();
    },
    onSuccess: (_data, payload) => {
      const isBulk = Array.isArray(payload);
      setToastConfig({
        type: "success",
        message: isBulk ? "Selected tasks restored." : "Task restored.",
      });
      setSelectedIds([]);
      closeModal();
      queryClient.invalidateQueries({ queryKey: trashQueryKey });
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
    },
  });

  const hardDeleteMutation = useMutation({
    mutationFn: async (payload) => {
      if (Array.isArray(payload)) {
        return api.delete("/tasks/bulk-hard-delete/", { data: { ids: payload } });
      }

      return api.delete(`/tasks/${payload}/hard-delete/`);
    },
    onMutate: async (payload) => {
      await queryClient.cancelQueries({ queryKey: trashQueryKey });
      const previousTrash = queryClient.getQueryData(trashQueryKey) ?? [];
      const ids = Array.isArray(payload) ? payload : [payload];

      queryClient.setQueryData(trashQueryKey, (current = []) =>
        current.filter((item) => !ids.includes(item.id))
      );

      return { previousTrash };
    },
    onError: (_err, _payload, context) => {
      queryClient.setQueryData(trashQueryKey, context?.previousTrash ?? []);
      setToastConfig({
        type: "error",
        message: "Failed to permanently delete task.",
      });
      closeModal();
    },
    onSuccess: (_data, payload) => {
      const isBulk = Array.isArray(payload);
      setToastConfig({
        type: "success",
        message: isBulk
          ? "Selected tasks permanently deleted."
          : "Task permanently deleted.",
      });
      setSelectedIds([]);
      closeModal();
      queryClient.invalidateQueries({ queryKey: trashQueryKey });
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
    },
  });

  const emptyTrashMutation = useMutation({
    mutationFn: () => api.delete("/tasks/empty_trash/"),
    onSuccess: () => {
      queryClient.setQueryData(trashQueryKey, []);
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
      setSelectedIds([]);
      closeModal();
      setToastConfig({ type: "success", message: "Trash emptied." });
    },
    onError: () => {
      closeModal();
      setToastConfig({ type: "error", message: "Failed to empty trash." });
    },
  });

  const isMutating =
    restoreMutation.isPending ||
    hardDeleteMutation.isPending ||
    emptyTrashMutation.isPending;

  const handleToggleSelection = (id) => {
    setSelectedIds((current) =>
      current.includes(id)
        ? current.filter((value) => value !== id)
        : [...current, id]
    );
  };

  const handleToggleAll = () => {
    if (allVisibleSelected) {
      setSelectedIds([]);
      return;
    }

    setSelectedIds(processedItems.map((item) => item.id));
  };

  const handleConfirm = () => {
    if (modalConfig.type === "restore") {
      restoreMutation.mutate(modalConfig.payload);
      return;
    }

    if (modalConfig.type === "delete") {
      hardDeleteMutation.mutate(modalConfig.payload);
      return;
    }

    if (modalConfig.type === "empty") {
      emptyTrashMutation.mutate();
    }
  };

  if (!user) {
    return <Navigate to="/dashboard" replace />;
  }

  if (!canViewTrash(userRole)) {
    return <Navigate to="/dashboard" replace />;
  }

  return (
    <div className="flex flex-col flex-1 w-full max-w-6xl mx-auto px-6 py-8 pb-24">
      <div className="flex flex-col gap-6 mb-8">
        <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full bg-amber-50 text-amber-700 px-3 py-1 text-xs font-semibold mb-3">
              <Trash2 className="h-3.5 w-3.5" />
              Recovery Workspace
            </div>
            <h1 className="text-3xl font-semibold text-slate-900">Trash</h1>
            <p className="text-sm text-slate-500 mt-1">
              Review deleted tasks, restore what you need, or permanently remove them.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <label className="relative min-w-[280px]">
              <Search className="h-4 w-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(event) => setSearchQuery(event.target.value)}
                placeholder="Search title, description, or project..."
                className="w-full rounded-xl border border-slate-200 bg-white py-2.5 pl-9 pr-3 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              />
            </label>

            <button
              onClick={() => refetch()}
              disabled={isFetching || isMutating}
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-60"
            >
              <RefreshCw className={`h-4 w-4 ${isFetching ? "animate-spin" : ""}`} />
              Refresh
            </button>

            {canDelete && trashedItems.length > 0 ? (
              <button
                onClick={() => openModal("empty")}
                disabled={isMutating}
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-red-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-60"
              >
                <Trash2 className="h-4 w-4" />
                Empty Trash
              </button>
            ) : null}
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="rounded-2xl border border-slate-200 bg-white p-4">
            <p className="text-sm text-slate-500">Deleted items</p>
            <p className="mt-1 text-2xl font-semibold text-slate-900">{trashedItems.length}</p>
          </div>
          <div className="rounded-2xl border border-slate-200 bg-white p-4">
            <p className="text-sm text-slate-500">Visible results</p>
            <p className="mt-1 text-2xl font-semibold text-slate-900">{processedItems.length}</p>
          </div>
          <div className="rounded-2xl border border-slate-200 bg-white p-4">
            <p className="text-sm text-slate-500">Selected</p>
            <p className="mt-1 text-2xl font-semibold text-slate-900">{selectedCount}</p>
          </div>
        </div>
      </div>

      {selectedCount > 0 && canEdit ? (
        <div className="mb-5 rounded-2xl border border-blue-200 bg-blue-50 px-4 py-3 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div className="text-sm font-medium text-blue-900">
            {selectedCount} task{selectedCount > 1 ? "s" : ""} selected
          </div>

          <div className="flex flex-wrap gap-2">
            {canRestore ? (
              <button
                onClick={() => openModal("restore", selectedIds)}
                disabled={isMutating}
                className="inline-flex items-center gap-2 rounded-xl border border-blue-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-60"
              >
                <Undo2 className="h-4 w-4" />
                Restore Selected
              </button>
            ) : null}

            {canDelete ? (
              <button
                onClick={() => openModal("delete", selectedIds)}
                disabled={isMutating}
                className="inline-flex items-center gap-2 rounded-xl bg-red-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-60"
              >
                <Trash2 className="h-4 w-4" />
                Delete Selected
              </button>
            ) : null}
          </div>
        </div>
      ) : null}

      {isLoading ? (
        <div className="rounded-2xl border border-slate-200 bg-white p-10 flex items-center justify-center gap-3 text-slate-500">
          <Loader2 className="h-5 w-5 animate-spin" />
          <span className="text-sm font-medium">Loading trash…</span>
        </div>
      ) : isError ? (
        <div className="rounded-2xl border border-red-200 bg-red-50 p-8 text-center">
          <AlertTriangle className="h-10 w-10 text-red-500 mx-auto mb-3" />
          <h2 className="text-lg font-semibold text-slate-900">Unable to load trash</h2>
          <p className="mt-1 text-sm text-slate-600">
            {error?.response?.data?.detail || error?.message || "Please try again."}
          </p>
          <button
            onClick={() => refetch()}
            className="mt-5 inline-flex items-center gap-2 rounded-xl bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-slate-800"
          >
            <RefreshCw className="h-4 w-4" />
            Retry
          </button>
        </div>
      ) : processedItems.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-slate-200 bg-slate-50 px-6 py-20 text-center">
          <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-white shadow-sm">
            <Trash2 className="h-7 w-7 text-slate-400" />
          </div>
          <h2 className="text-lg font-semibold text-slate-900">
            {searchQuery.trim() ? "No matching tasks" : "Trash is empty"}
          </h2>
          <p className="mt-1 text-sm text-slate-500">
            {searchQuery.trim()
              ? "Try a different search term."
              : "Deleted tasks will appear here for recovery."}
          </p>
        </div>
      ) : (
        <div className="rounded-2xl border border-slate-200 bg-white overflow-hidden">
          <div className="border-b border-slate-200 px-4 py-3 flex items-center gap-4 bg-slate-50">
            {canEdit ? (
              <button
                type="button"
                onClick={handleToggleAll}
                className="inline-flex items-center gap-2 text-sm font-medium text-slate-700"
              >
                {allVisibleSelected ? (
                  <CheckSquare className="h-4 w-4 text-blue-600" />
                ) : (
                  <Square className="h-4 w-4 text-slate-400" />
                )}
                Select all visible
              </button>
            ) : (
              <div className="text-sm font-medium text-slate-500">Deleted tasks</div>
            )}
          </div>

          <div className="divide-y divide-slate-100">
            {processedItems.map((item) => {
              const isSelected = selectedIds.includes(item.id);

              return (
                <div
                  key={item.id}
                  className={`px-4 py-4 transition ${
                    isSelected ? "bg-blue-50/60" : "bg-white hover:bg-slate-50/80"
                  }`}
                >
                  <div className="flex flex-col lg:flex-row lg:items-center gap-4">
                    <div className="flex items-start gap-4 flex-1 min-w-0">
                      {canEdit ? (
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={() => handleToggleSelection(item.id)}
                          className="mt-1 h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                        />
                      ) : null}

                      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-slate-100 text-slate-500">
                        <Trash2 className="h-5 w-5" />
                      </div>

                      <div className="min-w-0 flex-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <h3 className="truncate text-sm font-semibold text-slate-900">
                            {item.title}
                          </h3>
                          {item.status ? (
                            <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[11px] font-semibold uppercase tracking-wide text-slate-600">
                              {String(item.status).replaceAll("_", " ")}
                            </span>
                          ) : null}
                        </div>

                        <p className="mt-1 line-clamp-1 text-sm text-slate-500">
                          {item.description?.trim() || "No description"}
                        </p>

                        <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-xs text-slate-500">
                          <span>{getItemSubtitle(item)}</span>
                          {item.project ? (
                            <span>
                              Project: {item.project.name || item.project.public_id || item.project}
                            </span>
                          ) : null}
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-2 lg:justify-end">
                      {canRestore ? (
                        <button
                          onClick={() => openModal("restore", item.id)}
                          disabled={isMutating}
                          className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-60"
                        >
                          <Undo2 className="h-4 w-4" />
                          Restore
                        </button>
                      ) : null}

                      {canDelete ? (
                        <button
                          onClick={() => openModal("delete", item.id)}
                          disabled={isMutating}
                          className="inline-flex items-center gap-2 rounded-xl bg-red-50 px-3.5 py-2 text-sm font-semibold text-red-700 transition hover:bg-red-100 disabled:cursor-not-allowed disabled:opacity-60"
                        >
                          <Trash2 className="h-4 w-4" />
                          Delete Permanently
                        </button>
                      ) : null}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      <ConfirmModal
        isOpen={modalConfig.isOpen}
        onClose={closeModal}
        onConfirm={handleConfirm}
        title={
          modalConfig.type === "empty"
            ? "Empty Trash"
            : modalConfig.type === "restore"
              ? Array.isArray(modalConfig.payload)
                ? "Restore Selected Tasks"
                : "Restore Task"
              : Array.isArray(modalConfig.payload)
                ? "Delete Selected Tasks"
                : "Delete Task Permanently"
        }
        message={
          modalConfig.type === "empty"
            ? "This permanently deletes every trashed task in the current organization. This action cannot be undone."
            : modalConfig.type === "restore"
              ? Array.isArray(modalConfig.payload)
                ? "The selected tasks will be restored to the active workspace."
                : "This task will be restored to the active workspace."
              : Array.isArray(modalConfig.payload)
                ? "The selected tasks will be permanently deleted and cannot be recovered."
                : "This task will be permanently deleted and cannot be recovered."
        }
        confirmText={
          modalConfig.type === "empty"
            ? "Empty Trash"
            : modalConfig.type === "restore"
              ? "Restore"
              : "Delete"
        }
        isDanger={modalConfig.type !== "restore"}
        isLoading={isMutating}
      />

      {toastConfig ? (
        <Toast
          type={toastConfig.type}
          message={toastConfig.message}
          onClose={() => setToastConfig(null)}
        />
      ) : null}
    </div>
  );
};

export default Trash;
