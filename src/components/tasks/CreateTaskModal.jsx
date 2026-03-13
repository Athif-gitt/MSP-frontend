import { useState } from "react";
import api from "../../services/api";

const CreateTaskModal = ({ projectId, onClose }) => {

    const [title, setTitle] = useState("");

    const handleCreate = async () => {
        await api.post(`/tasks/?project=${projectId}`, {
            title,
            status: "TODO"
        });

        onClose();
    };

    return (
        <div className="fixed inset-0 bg-black/30 flex items-center justify-center">

            <div className="bg-white p-6 rounded-lg w-[400px]">

                <h2 className="text-lg font-semibold mb-4">
                    Create Task
                </h2>

                <input
                    className="w-full border p-2 rounded mb-4"
                    placeholder="Task title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                />

                <div className="flex justify-end gap-2">

                    <button onClick={onClose}>
                        Cancel
                    </button>

                    <button
                        onClick={handleCreate}
                        className="bg-blue-600 text-white px-3 py-1 rounded"
                    >
                        Create
                    </button>

                </div>

            </div>

        </div>
    );
};

export default CreateTaskModal;