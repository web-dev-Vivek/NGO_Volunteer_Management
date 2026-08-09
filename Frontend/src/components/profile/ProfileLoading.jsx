const ProfileLoading = () => {
    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100">

            <div className="bg-white rounded-xl shadow-lg p-10 text-center w-full max-w-lg">

                <div className="w-16 h-16 mx-auto border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>

                <h2 className="text-2xl font-semibold mt-6">
                    Loading Profile...
                </h2>

                <p className="text-gray-500 mt-2">
                    Please wait while we fetch your profile.
                </p>

            </div>

        </div>
    );
};

export default ProfileLoading;