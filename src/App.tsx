import "./App.css";
import RequireAuth from "./components/RequireAuth";
import RequireSetup from "./components/RequireSetup";
import { AppContext } from "./context/app-context";
import "./i18n/config";
import AppPage from "@/pages/Apps/AppPage";
import Login from "@/pages/Login";
import {
	type FC,
	Suspense,
	lazy,
	useContext,
	useEffect,
	useState,
} from "react";
import { Route, Routes, useLocation, useNavigate } from "react-router-dom";
import Layout from "./layouts/Layout";
import LoadingScreen from "./layouts/LoadingScreen";
import SkeletonLoadingScreen from "./layouts/SkeletonLoadingScreen";
import { SetupPhase } from "./models/setup.model";
import { ACCESS_TOKEN, REFRESH_TIME, parseJwt } from "./utils";
import { instance } from "./utils/interceptor";
import "react-toastify/dist/ReactToastify.css";

const LazySetup = lazy(() => import("./pages/Setup"));
const LazyHome = lazy(() => import("./pages/Home"));
const LazyApps = lazy(() => import("./pages/Apps"));
const LazySettings = lazy(() => import("./pages/Settings"));
const LazyAppInfo = lazy(() => import("./pages/Apps/AppInfo"));

const App: FC = () => {
	const [isLoading, setIsLoading] = useState(true);
	const [firstCall, setFirstCall] = useState(true);
	const [needsSetup, setNeedsSetup] = useState(false);
	const { isLoggedIn } = useContext(AppContext);
	const navigate = useNavigate();
	const { pathname } = useLocation();

	useEffect(() => {
		if (firstCall) {
			async function check() {
				setFirstCall(false);
				if (pathname.startsWith("/login")) {
					setIsLoading(false);
					return;
				}
				await instance.get("/setup/status").then((resp) => {
					const setupPhase = resp.data.setupPhase;
					const initialSync = resp.data.initialsync;
					if (setupPhase !== SetupPhase.DONE || initialSync === "running") {
						setNeedsSetup(true);
						navigate("/setup");
					} else {
						setNeedsSetup(false);
					}
					setIsLoading(false);
				});
			}

			check();
		}
	}, [firstCall, navigate, pathname]);

	useEffect(() => {
		if (!isLoggedIn) {
			return;
		}

		function refresh(triggerTime: number) {
			setTimeout(() => doRefresh(), triggerTime);
		}

		function doRefresh() {
			if (!localStorage.getItem(ACCESS_TOKEN)) {
				return;
			}
			instance
				.post("system/refresh-token", {})
				.then((resp) => {
					const token = resp.data;
					if (token) {
						localStorage.setItem(ACCESS_TOKEN, token);
						const payload = parseJwt(token);
						refresh(REFRESH_TIME(payload.expires));
					}
				})
				.catch((e) => {
					console.error("Error: token refresh failed with: ", e);
				});
		}

		const token = localStorage.getItem(ACCESS_TOKEN);
		if (token) {
			const payload = parseJwt(token);
			refresh(REFRESH_TIME(payload.expires));
		}
	}, [isLoggedIn]);

	if (isLoading) {
		return <LoadingScreen />;
	}

	return (
		<Routes>
			<Route path="/" element={<Login />} />
			<Route path="/login" element={<Login />} />
			<Route
				path="/setup"
				element={
					<Suspense fallback={<LoadingScreen />}>
						<RequireSetup needsSetup={needsSetup}>
							<LazySetup />
						</RequireSetup>
					</Suspense>
				}
			/>
			<Route
				path="/home"
				element={
					<Suspense fallback={<SkeletonLoadingScreen />}>
						<RequireAuth>
							<Layout>
								<LazyHome />
							</Layout>
						</RequireAuth>
					</Suspense>
				}
			/>
			<Route
				path="/apps"
				element={
					<Suspense fallback={<SkeletonLoadingScreen />}>
						<RequireAuth>
							<Layout>
								<LazyApps />
							</Layout>
						</RequireAuth>
					</Suspense>
				}
			/>
			<Route
				path="/settings"
				element={
					<Suspense fallback={<SkeletonLoadingScreen />}>
						<RequireAuth>
							<Layout>
								<LazySettings />
							</Layout>
						</RequireAuth>
					</Suspense>
				}
			/>
			<Route
				path="/apps/:appId/info"
				element={
					<Suspense fallback={<SkeletonLoadingScreen />}>
						<RequireAuth>
							<Layout>
								<LazyAppInfo />
							</Layout>
						</RequireAuth>
					</Suspense>
				}
			/>
			<Route
				path="/apps/:appId"
				element={
					<Suspense fallback={<SkeletonLoadingScreen />}>
						<RequireAuth>
							<Layout>
								<AppPage />
							</Layout>
						</RequireAuth>
					</Suspense>
				}
			/>
		</Routes>
	);
};

export default App;
