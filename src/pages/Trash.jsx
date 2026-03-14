import React, { useState, useMemo } from "react"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { Navigate } from "react-router-dom"
import api from "../services/api"
import { useAuth } from "../context/AuthContext"
import { canViewTrash, canRestoreTask, canDeleteTask } from "../utils/permissions"

import ConfirmModal from "../components/ConfirmModal"
import Toast from "../components/Toast"

const Trash = () => {
  const queryClient = useQueryClient()
  const { user } = useAuth()

  const [searchQuery, setSearchQuery] = useState("")
  const [selectedIds, setSelectedIds] = useState([])
  const [modalConfig, setModalConfig] = useState({ isOpen: false, type: null, payload: null })
  const [toastConfig, setToastConfig] = useState(null)

  const { data: trashedItems = [], isLoading } = useQuery({
    queryKey: ["trash"],
    queryFn: async () => {
      const res = await api.get("/tasks/trash/")
      return res.data
    },
  })

  const restoreMutation = useMutation({
    mutationFn: async (payload) => {
      if (Array.isArray(payload)) {
        return api.post("/tasks/bulk-restore/", { ids: payload })
      } else {
        return api.post(`/tasks/${payload}/restore/`)
      }
    },
    onMutate: async (payload) => {
      await queryClient.cancelQueries({ queryKey: ["trash"] })
      const previousTrash = queryClient.getQueryData(["trash"])

      const idsArray = Array.isArray(payload) ? payload : [payload]

      queryClient.setQueryData(["trash"], (old) =>
        old?.filter(item => !idsArray.includes(item.id))
      )

      return { previousTrash }
    },
    onError: (err, payload, context) => {
      queryClient.setQueryData(["trash"], context.previousTrash)
      setToastConfig({ type: "error", message: "Something went wrong." })
      setModalConfig({ isOpen: false })
    },
    onSuccess: (data, payload) => {
      const isBulk = Array.isArray(payload)
      setToastConfig({ type: "success", message: isBulk ? "Tasks restored" : "Task restored" })
      setSelectedIds([])
      setModalConfig({ isOpen: false })
      queryClient.invalidateQueries({ queryKey: ["trash"] })
    },
  })

  const hardDeleteMutation = useMutation({
    mutationFn: async (payload) => {
      if (Array.isArray(payload)) {
        return api.delete("/tasks/bulk-hard-delete/", { data: { ids: payload } })
      } else {
        return api.delete(`/tasks/${payload}/hard-delete/`)
      }
    },
    onMutate: async (payload) => {
      await queryClient.cancelQueries({ queryKey: ["trash"] })
      const previousTrash = queryClient.getQueryData(["trash"])

      const idsArray = Array.isArray(payload) ? payload : [payload]

      queryClient.setQueryData(["trash"], (old) =>
        old?.filter(item => !idsArray.includes(item.id))
      )

      return { previousTrash }
    },
    onError: (err, payload, context) => {
      queryClient.setQueryData(["trash"], context.previousTrash)
      setToastConfig({ type: "error", message: "Something went wrong." })
      setModalConfig({ isOpen: false })
    },
    onSuccess: (data, payload) => {
      const isBulk = Array.isArray(payload)
      setToastConfig({
        type: "success",
        message: isBulk ? "Tasks permanently deleted" : "Task permanently deleted",
      })
      setSelectedIds([])
      setModalConfig({ isOpen: false })
      queryClient.invalidateQueries({ queryKey: ["trash"] })
    },
  })

  const emptyTrashMutation = useMutation({
    mutationFn: () => api.delete("/tasks/empty_trash/"),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["trash"] })
      setToastConfig({ type: "success", message: "Trash emptied" })
      setSelectedIds([])
      setModalConfig({ isOpen: false })
    },
  })

  const processedItems = useMemo(() => {
    let items = [...trashedItems]

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase()
      items = items.filter(item => item.title.toLowerCase().includes(q))
    }

    items.sort((a, b) => new Date(b.deleted_at) - new Date(a.deleted_at))

    return items
  }, [trashedItems, searchQuery])

  const toggleSelection = (id) => {
    setSelectedIds(prev =>
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    )
  }

  const toggleAll = () => {
    if (selectedIds.length === processedItems.length) {
      setSelectedIds([])
    } else {
      setSelectedIds(processedItems.map(item => item.id))
    }
  }

  const canEdit = canRestoreTask(user?.role) || canDeleteTask(user?.role)

  if (!user || !canViewTrash(user?.role)) {
    return <Navigate to="/dashboard" replace />
  }

  if (isLoading) {
    return (
      <div className="flex flex-col flex-1 px-8 py-8 w-full max-w-5xl mx-auto space-y-4">
        <div className="h-10 w-48 bg-slate-200 rounded animate-pulse mb-8"></div>
        <div className="h-20 w-full bg-slate-200 rounded-xl animate-pulse"></div>
      </div>
    )
  }

  return (
    <div className="flex flex-col flex-1 px-8 py-8 w-full max-w-5xl mx-auto pb-24 animate-in fade-in duration-300">

      {/* Header */}
      <div className="flex flex-col gap-6 mb-8">

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">

          <div>
            <h1 className="text-3xl font-semibold text-slate-900 dark:text-white">
              Trash
            </h1>
            <p className="text-sm text-slate-500 mt-1">
              Items here will be permanently deleted after 30 days.
            </p>
          </div>

          <div className="flex items-center gap-3">

            <div className="relative w-64">
              <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-[18px]">
                search
              </span>

              <input
                type="text"
                placeholder="Search deleted tasks..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3 py-2 border border-slate-200 rounded-lg text-sm outline-none focus:ring-2 focus:ring-primary/40 shadow-sm"
              />
            </div>

            {canDeleteTask(user?.role) && trashedItems.length > 0 && (
              <button
                onClick={() => setModalConfig({ isOpen: true, type: "empty" })}
                className="flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white text-sm font-semibold rounded-lg shadow-sm"
              >
                <span className="material-symbols-outlined text-[18px]">
                  delete_forever
                </span>
                Empty Trash
              </button>
            )}

          </div>

        </div>

        <div className="border-b border-slate-200"></div>

      </div>

      {/* Bulk Toolbar */}
      {selectedIds.length > 0 && canEdit && (
        <div className="flex items-center justify-between bg-primary/10 border border-primary/30 rounded-xl px-4 py-3 mb-4 shadow-sm">
          <span className="text-primary font-semibold text-sm">
            {selectedIds.length} selected
          </span>

          <div className="flex gap-2">

            <button
              onClick={() => restoreMutation.mutate(selectedIds)}
              className="px-4 py-2 text-sm font-semibold bg-white border rounded-lg hover:bg-primary hover:text-white transition"
            >
              Restore
            </button>

            <button
              onClick={() => hardDeleteMutation.mutate(selectedIds)}
              className="px-4 py-2 text-sm font-semibold bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
            >
              Delete Permanently
            </button>

          </div>
        </div>
      )}

      {/* Empty State */}
      {processedItems.length === 0 && (
        <div className="flex flex-col items-center justify-center py-20 text-center bg-slate-50 border border-dashed border-slate-200 rounded-2xl">
          <div className="w-16 h-16 flex items-center justify-center rounded-full bg-slate-100 mb-5">
            <span className="material-symbols-outlined text-[30px] text-slate-400">
              delete
            </span>
          </div>

          <h3 className="text-lg font-semibold text-slate-900">
            Trash is empty
          </h3>

          <p className="text-sm text-slate-500 mt-1">
            Deleted tasks will appear here.
          </p>
        </div>
      )}

      {/* Trash Items */}
      <div className="flex flex-col gap-3">
        {processedItems.map(item => (
          <div
            key={item.id}
            className="flex items-center gap-4 p-4 bg-white rounded-xl border border-slate-100 hover:shadow-md transition"
          >

            {canEdit && (
              <input
                type="checkbox"
                checked={selectedIds.includes(item.id)}
                onChange={() => toggleSelection(item.id)}
                className="w-4 h-4 cursor-pointer"
              />
            )}

            <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
              <span className="material-symbols-outlined text-[28px] text-primary">
                delete
              </span>
            </div>

            <div className="flex-1">
              <p className="font-semibold">{item.title}</p>
              <p className="text-sm text-slate-500">
                Deleted {new Date(item.deleted_at).toLocaleDateString()}
              </p>
            </div>

            <div className="flex gap-2">

              {canRestoreTask(user?.role) && (
                <button
                  onClick={() => restoreMutation.mutate(item.id)}
                  className="px-3 py-1.5 text-sm bg-slate-100 rounded-lg hover:bg-primary hover:text-white transition"
                >
                  Restore
                </button>
              )}

              {canDeleteTask(user?.role) && (
                <button
                  onClick={() => hardDeleteMutation.mutate(item.id)}
                  className="px-3 py-1.5 text-sm bg-red-50 text-red-600 rounded-lg hover:bg-red-600 hover:text-white transition"
                >
                  Delete
                </button>
              )}

            </div>
          </div>
        ))}
      </div>

      <ConfirmModal
        isOpen={modalConfig.isOpen}
        onClose={() => setModalConfig({ isOpen: false })}
        onConfirm={() => {}}
      />

      {toastConfig && (
        <Toast
          type={toastConfig.type}
          message={toastConfig.message}
          onClose={() => setToastConfig(null)}
        />
      )}

    </div>
  )
}

export default Trash