import { useForm } from 'react-hook-form';
import { createTask, deleteTask, getTask, updateTask } from '../api/tasks.api';
import { useNavigate, useParams } from 'react-router-dom';
import { useEffect } from 'react';
import { toast } from 'react-hot-toast';

const TasksFormPage = () => {
    const {
        register,
        handleSubmit,
        formState: { errors },
        setValue,
    } = useForm();
    const params = useParams();
    const navigate = useNavigate();
    const onSubmit = handleSubmit(async (data) => {
        if (params.id) {
            await updateTask(params.id, data);
            toast.success('Your task was succesfully updated', {
                position: 'bottom-center',
                style: {
                    background: '#101010',
                    color: '#fff',
                },
            });
        } else {
            await createTask(data);
            toast.success('Your task was succesfully created', {
                position: 'bottom-center',
                style: {
                    background: '#101010',
                    color: '#fff',
                },
            });
        }
        navigate('/tasks');
    });

    useEffect(() => {
        async function loadTask() {
            if (params.id) {
                const res = await getTask(params.id);
                setValue('title', res.data.title);
                setValue('description', res.data.description);
            }
        }
        loadTask();
    }, []);

    return (
        <div className="max-w-xl mx-auto">
            <form onSubmit={onSubmit}>
                <input
                    type="text"
                    placeholder="title"
                    className="bg-zinc-700 p-3 rounded-lg block w-full mb-3"
                    {...register('title', { required: true })}
                />
                {errors.title && <span>Title is required</span>}
                <textarea
                    rows="3"
                    placeholder="Description"
                    className="bg-zinc-700 p-3 rounded-lg block w-full mb-3"
                    {...register('description', { required: true })}
                ></textarea>
                {errors.description && <span>Description is required</span>}
                <button className="bg-cyan-500 p-3 rounded-lg block hover:bg-cyan-400 hover:cursor-pointer w-full mt-3">
                    Save
                </button>
            </form>
            {params.id && (
                <div className="flex justify-end">
                    <button
                        className="bg-red-500 p-3 rounded-lg block w-48 mt-3  hover:bg-red-400 hover:cursor-pointer"
                        onClick={async () => {
                            const accepted = window.confirm('Are you sure?');
                            if (accepted) {
                                await deleteTask(params.id);

                                toast.success(
                                    'Your task was succesfully deleted',
                                    {
                                        position: 'bottom-center',
                                        style: {
                                            background: '#101010',
                                            color: '#f25252',
                                        },
                                    },
                                );
                                navigate('/tasks');
                            }
                        }}
                    >
                        Delete
                    </button>
                </div>
            )}
        </div>
    );
};

export default TasksFormPage;
