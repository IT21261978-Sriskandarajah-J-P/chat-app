import { BiLogOut } from "react-icons/bi";
import useLogout from "../../hooks/useLogout";

const LogoutButton = () => {
	const { loading, logout } = useLogout();

	return (
		<div className='mt-auto'>
			{!loading ? (
				<BiLogOut className="w-6 h-6 text-white cursor-pointer transition duration-300 ease-in-out transform hover:scale-110" onClick={logout} onMouseEnter={() => setShowLogoutMessage(true)} onMouseLeave={() => setShowLogoutMessage(false)} />
			) : (
				<span className='loading loading-spinner'></span>
			)}
		</div>
	);
};
export default LogoutButton;
