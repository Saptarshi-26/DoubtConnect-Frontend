import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";

function GoogleConnectPage() {

  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);

  const [connected, setConnected] = useState(false);

  const profileId = localStorage.getItem("profileId");

  useEffect(() => {
    checkConnection();
  }, []);

  const checkConnection = async () => {

    try {

      const res = await api.get(
        `/oauth/google/status/${profileId}`
      );

      setConnected(res.data.connected);

    } catch {

      setConnected(false);

    }

  };

  const connectGoogle = async () => {

    try {

      setLoading(true);

     const res = await api.get(
  `/oauth/google/connect?teacherProfileId=${profileId}`
);

window.location.href = res.data;

    } catch {

      alert("Unable to connect Google Calendar.");

      setLoading(false);

    }

  };

  return (

    <div className="min-h-screen bg-gradient-to-br from-slate-100 via-blue-50 to-slate-100">

      <div className="mx-auto flex min-h-screen max-w-7xl items-center gap-14 px-8">

        {/* Left */}

        <div className="hidden w-2/5 lg:block">

          <p className="font-semibold text-blue-600">

            Educator Onboarding

          </p>

          <h1 className="mt-6 text-5xl font-bold leading-tight text-slate-900">

            Connect
            <br />
            Google
            <br />
            Calendar

          </h1>

          <p className="mt-8 text-lg leading-9 text-slate-600">

            DoubtConnect uses your Google Calendar
            to create Google Meet links and keep
            your teaching schedule synchronized.

          </p>

          <div className="mt-12 rounded-3xl bg-white p-8 shadow-xl">

            <h3 className="text-2xl font-bold">

              Why connect?

            </h3>

            <ul className="mt-6 space-y-4 text-slate-600">

              <li>📅 Automatic calendar events</li>

              <li>🎥 Google Meet generation</li>

              <li>⛔ Prevent double bookings</li>

              <li>✅ Required before managing availability</li>

            </ul>

          </div>

        </div>

        {/* Right */}

        <div className="flex-1">

          <div className="rounded-[32px] bg-white p-12 shadow-2xl">

            <div className="text-center">

              <div className="text-7xl">

                📅

              </div>

              <h2 className="mt-6 text-4xl font-bold text-slate-900">

                Google Calendar

              </h2>

              <p className="mt-4 text-lg text-slate-500">

                Connect your Google account to
                continue onboarding.

              </p>            </div>

            <div className="mt-10 rounded-2xl border border-slate-200 bg-slate-50 p-6">

              <div className="flex items-center justify-between">

                <div>

                  <p className="text-lg font-semibold text-slate-800">
                    Connection Status
                  </p>

                  <p className="mt-2 text-slate-500">

                    {connected
                      ? "Your Google Calendar is connected."
                      : "Google Calendar has not been connected yet."}

                  </p>

                </div>

                <div
                  className={`rounded-full px-5 py-2 font-semibold ${
                    connected
                      ? "bg-green-100 text-green-700"
                      : "bg-red-100 text-red-700"
                  }`}
                >
                  {connected ? "Connected" : "Not Connected"}
                </div>

              </div>

            </div>

            {connected ? (

              <button
                onClick={() => navigate("/teacher-availability")}
                className="mt-10 w-full rounded-2xl bg-green-600 py-4 text-lg font-semibold text-white transition hover:bg-green-500"
              >
                Continue to Availability
              </button>

            ) : (

              <button
                onClick={connectGoogle}
                disabled={loading}
                className="mt-10 w-full rounded-2xl bg-blue-600 py-4 text-lg font-semibold text-white transition hover:bg-blue-500 disabled:bg-slate-400"
              >
                {loading
                  ? "Redirecting..."
                  : "Connect Google Calendar"}
              </button>

            )}

          </div>

        </div>

      </div>

    </div>

  );

}

export default GoogleConnectPage;