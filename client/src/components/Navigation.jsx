import { Link } from 'react-router-dom';

const Navigation = () => {
    return (
        <div className="flex justify-between py-3">
            <Link to="/tasks">
                <h1 className="font-bold text-slate-200 text-3xl my-4">
                    Django + React TodoList
                </h1>
            </Link>
            <button className="bg-cyan-600 font-semibold text-slate-200 my-2 px-3 py-2 rounded-lg hover:bg-cyan-500 hover:cursor-pointer">
                <Link to="/tasks-create">Create ToDo</Link>
            </button>
        </div>
    );
};
export default Navigation;
