import { useEffect, useId, useMemo, useRef, useState } from "react";
import { CircleAlert, Loader2, Sparkles, Trash2, WandSparkles, X } from "lucide-react";
import Toast from "../Toast";
import { useGenerateSubtasks } from "../../hooks/useGenerateSubtasks";
import { useSaveSubtasks } from "../../hooks/useSaveSubtasks";

function createDraftSubtask(title = "") {
  return {
    id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    title,
  };
}

function normalizeGeneratedSubtasks(subtasks = []) {
  return subtasks
    .map((subtask) => createDraftSubtask(subtask?.title?.trim?.() ?? ""))
    .filter((subtask) => subtask.title);
}

function extractErrorMessage(error, fallbackMessage) {
  const data = error?.response?.data;

  if (typeof data === "string" && data.trim()) {
    return data;
  }

  if (typeof data?.detail === "string" && data.detail.trim()) {
    return data.detail;
  }

  if (Array.isArray(data?.subtasks) && data.subtasks[0]) {
    return String(data.subtasks[0]);
  }

  if (data && typeof data === "object") {
    const firstValue = Object.values(data)[0];

    if (Array.isArray(firstValue) && firstValue[0]) {
      return String(firstValue[0]);
    }

    if (typeof firstValue === "string" && firstValue.trim()) {
      return firstValue;
    }
  }

  if (typeof error?.message === "string" && error.message.trim()) {
    return error.message;
  }

  return fallbackMessage;
}

const FOCUSABLE_SELECTOR =
  'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])';

const AISubtaskGenerator = ({ taskId }) => {
  const titleInputId = useId();
  const modalRef = useRef(null);
  const isBusyRef = useRef(false);
  const closeAndResetRef = useRef(() => {});
  const [isOpen, setIsOpen] = useState(false);
  const [priorityHint, setPriorityHint] = useState("");
  const [draftSubtasks, setDraftSubtasks] = useState([]);
  const [toastConfig, setToastConfig] = useState(null);
  const [localError, setLocalError] = useState("");

  const generateSubtasksMutation = useGenerateSubtasks({
    onSuccess: (data) => {
      const nextSubtasks = normalizeGeneratedSubtasks(data?.subtasks ?? []);
      setDraftSubtasks(nextSubtasks);
      setLocalError(
        nextSubtasks.length === 0
          ? "No subtasks were generated this time. Try a different hint or add one manually."
          : ""
      );
    },
    onError: (error) => {
      setLocalError(extractErrorMessage(error, "Failed to generate subtasks."));
    },
  });

  const saveSubtasksMutation = useSaveSubtasks({
    onSuccess: () => {
      closeAndReset();
      setToastConfig({
        type: "success",
        message: "Subtasks created",
      });
    },
    onError: (error) => {
      setLocalError(extractErrorMessage(error, "Failed to save subtasks."));
    },
  });

  const hasDrafts = draftSubtasks.length > 0;
  const sanitizedSubtasks = useMemo(
    () =>
      draftSubtasks
        .map((subtask) => ({
          title: subtask.title.trim(),
        }))
        .filter((subtask) => subtask.title),
    [draftSubtasks]
  );

  const isBusy =
    generateSubtasksMutation.isPending || saveSubtasksMutation.isPending;

  function resetState() {
    setPriorityHint("");
    setDraftSubtasks([]);
    setLocalError("");
    generateSubtasksMutation.reset();
    saveSubtasksMutation.reset();
  }

  function handleOpen() {
    resetState();
    setIsOpen(true);
  }

  function closeAndReset() {
    setIsOpen(false);
    resetState();
  }

  function handleClose() {
    if (isBusy) return;
    closeAndReset();
  }

  function handleGenerate() {
    setLocalError("");
    generateSubtasksMutation.mutate({
      taskId,
      priorityHint: priorityHint.trim(),
    });
  }

  function handleAddSubtask() {
    setDraftSubtasks((current) => [...current, createDraftSubtask("")]);
    setLocalError("");
  }

  function handleSubtaskChange(id, value) {
    setDraftSubtasks((current) =>
      current.map((subtask) =>
        subtask.id === id
          ? {
              ...subtask,
              title: value,
            }
          : subtask
      )
    );
  }

  function handleDeleteSubtask(id) {
    setDraftSubtasks((current) => current.filter((subtask) => subtask.id !== id));
  }

  async function handleSave() {
    if (sanitizedSubtasks.length === 0) {
      setLocalError("Add at least one subtask before saving.");
      return;
    }

    setLocalError("");

    await saveSubtasksMutation.mutateAsync({
      parentTaskId: taskId,
      subtasks: sanitizedSubtasks,
    });
  }

  useEffect(() => {
    isBusyRef.current = isBusy;
    closeAndResetRef.current = () => {
      setIsOpen(false);
      setPriorityHint("");
      setDraftSubtasks([]);
      setLocalError("");
      generateSubtasksMutation.reset();
      saveSubtasksMutation.reset();
    };
  }, [generateSubtasksMutation, isBusy, saveSubtasksMutation]);

  useEffect(() => {
    if (!isOpen) return undefined;

    const handleKeyDown = (event) => {
      if (event.key === "Escape") {
        event.preventDefault();
        if (isBusyRef.current) {
          return;
        }

        closeAndResetRef.current();
        return;
      }

      if (event.key !== "Tab" || !modalRef.current) {
        return;
      }

      const focusableElements = Array.from(
        modalRef.current.querySelectorAll(FOCUSABLE_SELECTOR)
      ).filter((element) => !element.hasAttribute("disabled"));

      if (focusableElements.length === 0) {
        return;
      }

      const firstElement = focusableElements[0];
      const lastElement = focusableElements[focusableElements.length - 1];

      if (event.shiftKey && document.activeElement === firstElement) {
        event.preventDefault();
        lastElement.focus();
      } else if (!event.shiftKey && document.activeElement === lastElement) {
        event.preventDefault();
        firstElement.focus();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;

    const frame = window.requestAnimationFrame(() => {
      const firstInput = modalRef.current?.querySelector("input");
      firstInput?.focus();
    });

    return () => window.cancelAnimationFrame(frame);
  }, [isOpen]);

  return (
    <>
      <button
        type="button"
        onClick={handleOpen}
        className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-sm font-semibold text-slate-700 transition hover:border-slate-300 hover:bg-slate-50"
      >
        <Sparkles className="h-4 w-4 text-amber-500" />
        <span>Generate Subtasks</span>
      </button>

      {isOpen ? (
        <div
          className="fixed inset-0 z-[60] flex items-center justify-center bg-slate-950/55 p-4 backdrop-blur-sm"
          onClick={handleClose}
        >
          <div
            ref={modalRef}
            role="dialog"
            aria-modal="true"
            aria-labelledby={titleInputId}
            className="flex max-h-[calc(100vh-2rem)] w-full max-w-3xl flex-col overflow-hidden rounded-[28px] border border-slate-200 bg-white shadow-2xl"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="border-b border-slate-100 bg-[radial-gradient(circle_at_top_left,_rgba(251,191,36,0.18),_transparent_35%),linear-gradient(180deg,_#ffffff_0%,_#f8fafc_100%)] px-6 py-5">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <div className="inline-flex items-center gap-2 rounded-full border border-amber-200 bg-white/80 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-amber-700">
                    <WandSparkles className="h-3.5 w-3.5" />
                    AI Assistant
                  </div>
                  <h2
                    id={titleInputId}
                    className="mt-3 text-2xl font-semibold tracking-tight text-slate-900"
                  >
                    Draft subtasks before you save them
                  </h2>
                  <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600">
                    Generate a starting point, tune each line, add your own items,
                    and only save when the list looks right.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={handleClose}
                  disabled={isBusy}
                  className="rounded-xl p-2 text-slate-400 transition hover:bg-white hover:text-slate-600 disabled:cursor-not-allowed disabled:opacity-60"
                  aria-label="Close AI subtask generator"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
            </div>

            <div className="overflow-y-auto px-6 py-6">
              <div className="grid gap-6 lg:grid-cols-[minmax(0,1.45fr)_280px]">
                <div className="space-y-5">
                  <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
                    <label
                      htmlFor={`${titleInputId}-hint`}
                      className="text-sm font-semibold text-slate-800"
                    >
                      Priority hint
                    </label>
                    <p className="mt-1 text-sm text-slate-500">
                      Guide the AI with tone or intent, like “Finish fast” or “Be precise”.
                    </p>

                    <div className="mt-4 flex flex-col gap-3 sm:flex-row">
                      <input
                        id={`${titleInputId}-hint`}
                        type="text"
                        value={priorityHint}
                        onChange={(event) => setPriorityHint(event.target.value)}
                        onKeyDown={(event) => {
                          if (event.key === "Enter" && !generateSubtasksMutation.isPending) {
                            event.preventDefault();
                            handleGenerate();
                          }
                        }}
                        disabled={isBusy}
                        placeholder="Finish fast"
                        className="flex-1 rounded-2xl border border-slate-200 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-amber-400 focus:ring-4 focus:ring-amber-100 disabled:cursor-not-allowed disabled:bg-slate-50"
                      />

                      <button
                        type="button"
                        onClick={handleGenerate}
                        disabled={generateSubtasksMutation.isPending || saveSubtasksMutation.isPending}
                        className="inline-flex min-w-[170px] items-center justify-center gap-2 rounded-2xl bg-slate-900 px-4 py-3 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60"
                      >
                        {generateSubtasksMutation.isPending ? (
                          <>
                            <Loader2 className="h-4 w-4 animate-spin" />
                            <span>Generating...</span>
                          </>
                        ) : (
                          <>
                            <Sparkles className="h-4 w-4 text-amber-300" />
                            <span>Generate Subtasks</span>
                          </>
                        )}
                      </button>
                    </div>
                  </div>

                  <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
                    <div className="flex items-center justify-between gap-3">
                      <div>
                        <h3 className="text-sm font-semibold text-slate-900">
                          Editable subtasks
                        </h3>
                        <p className="mt-1 text-sm text-slate-500">
                          Keep the good ideas, rewrite the weak ones, and remove anything unnecessary.
                        </p>
                      </div>

                      <button
                        type="button"
                        onClick={handleAddSubtask}
                        disabled={isBusy}
                        className="rounded-xl border border-slate-200 px-3 py-2 text-sm font-medium text-slate-600 transition hover:border-slate-300 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-60"
                      >
                        Add Subtask
                      </button>
                    </div>

                    <div className="mt-5 space-y-3">
                      {hasDrafts ? (
                        draftSubtasks.map((subtask, index) => (
                          <div
                            key={subtask.id}
                            className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-slate-50/80 px-3 py-3 transition duration-200"
                          >
                            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-white text-xs font-semibold text-slate-500 shadow-sm">
                              {index + 1}
                            </div>

                            <input
                              type="text"
                              value={subtask.title}
                              onChange={(event) =>
                                handleSubtaskChange(subtask.id, event.target.value)
                              }
                              onKeyDown={(event) => {
                                if (event.key === "Enter") {
                                  event.preventDefault();
                                  handleAddSubtask();
                                }
                              }}
                              placeholder="Write a subtask title"
                              disabled={isBusy}
                              className="flex-1 rounded-xl border border-transparent bg-white px-3 py-2.5 text-sm text-slate-900 outline-none transition focus:border-amber-300 focus:ring-4 focus:ring-amber-100 disabled:cursor-not-allowed disabled:bg-slate-100"
                            />

                            <button
                              type="button"
                              onClick={() => handleDeleteSubtask(subtask.id)}
                              disabled={isBusy}
                              className="rounded-xl p-2 text-slate-400 transition hover:bg-white hover:text-rose-600 disabled:cursor-not-allowed disabled:opacity-60"
                              aria-label={`Delete subtask ${index + 1}`}
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>
                        ))
                      ) : (
                        <div className="rounded-3xl border border-dashed border-slate-200 bg-slate-50 px-5 py-10 text-center">
                          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-white text-amber-500 shadow-sm">
                            <Sparkles className="h-5 w-5" />
                          </div>
                          <h4 className="mt-4 text-sm font-semibold text-slate-900">
                            No subtasks yet
                          </h4>
                          <p className="mt-2 text-sm leading-6 text-slate-500">
                            Generate a list with AI or start from scratch with a manual subtask.
                          </p>
                          <button
                            type="button"
                            onClick={handleAddSubtask}
                            disabled={isBusy}
                            className="mt-4 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:border-slate-300 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-60"
                          >
                            Add your first subtask
                          </button>
                        </div>
                      )}
                    </div>
                  </div>

                  {localError ? (
                    <div className="flex items-start gap-3 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                      <CircleAlert className="mt-0.5 h-4 w-4 shrink-0" />
                      <span>{localError}</span>
                    </div>
                  ) : null}
                </div>

                <aside className="space-y-4">
                  <div className="rounded-3xl border border-slate-200 bg-slate-50 p-5">
                    <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">
                      Ready To Save
                    </p>
                    <p className="mt-3 text-3xl font-semibold tracking-tight text-slate-900">
                      {sanitizedSubtasks.length}
                    </p>
                    <p className="mt-2 text-sm leading-6 text-slate-500">
                      Only non-empty titles will be saved to the task as real subtasks.
                    </p>
                  </div>

                  <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
                    <h3 className="text-sm font-semibold text-slate-900">Flow</h3>
                    <div className="mt-4 space-y-3 text-sm text-slate-600">
                      <div className="rounded-2xl bg-slate-50 px-3 py-3">
                        1. Add a hint for speed, quality, or approach.
                      </div>
                      <div className="rounded-2xl bg-slate-50 px-3 py-3">
                        2. Edit the AI output until it looks production-ready.
                      </div>
                      <div className="rounded-2xl bg-slate-50 px-3 py-3">
                        3. Save only when the final list is correct.
                      </div>
                    </div>
                  </div>
                </aside>
              </div>
            </div>

            <div className="flex flex-col-reverse gap-3 border-t border-slate-100 bg-slate-50 px-6 py-4 sm:flex-row sm:items-center sm:justify-between">
              <p className="text-sm text-slate-500">
                AI suggestions are never saved automatically.
              </p>

              <div className="flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={handleClose}
                  disabled={isBusy}
                  className="rounded-xl px-4 py-2.5 text-sm font-semibold text-slate-600 transition hover:bg-white disabled:cursor-not-allowed disabled:opacity-60"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleSave}
                  disabled={saveSubtasksMutation.isPending || sanitizedSubtasks.length === 0}
                  className="inline-flex min-w-[150px] items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {saveSubtasksMutation.isPending ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      <span>Saving...</span>
                    </>
                  ) : (
                    <span>Save Subtasks</span>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      ) : null}

      {toastConfig ? (
        <Toast
          type={toastConfig.type}
          message={toastConfig.message}
          onClose={() => setToastConfig(null)}
        />
      ) : null}
    </>
  );
};

export default AISubtaskGenerator;
