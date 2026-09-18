import { useNavigate } from 'react-router-dom';

const TaskCard = ({ task }) => {
    const navigate = useNavigate();
    return (
        <div
            className="bg-slate-700 p-4 rounded-lg hover:bg-zinc-600 hover:cursor-pointer"
            onClick={() => {
                navigate(`/tasks/${task.id}`);
            }}
        >
            <h1 className="font-bold uppercase">
                {task.id} - {task.title}
            </h1>
            <hr />
            <p className="text-slate-300">{task.description}</p>
        </div>
    );
};

export default TaskCard;
