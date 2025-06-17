import { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { toast } from "@/hooks/use-toast";
import Logo from "@/components/logo";
import { Card, CardContent } from "@/components/ui/card";
import { Loader } from "lucide-react";
import API from "@/lib/axios-client";

const GoogleOAuthCallback = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const status = searchParams.get("status");
  const error = searchParams.get("error");
  const workspaceId = searchParams.get("workspaceId");

  useEffect(() => {
    const handleCallback = async () => {
      if (status === "success") {
        try {
          const response = await API.get('/user/current');
          
          if (response.data?.user) {
            toast({
              title: "Success",
              description: "Successfully signed in with Google!",
            });

            if (workspaceId) {
              navigate(`/workspace/${workspaceId}`, { replace: true });
            } else {
              navigate("/", { replace: true });
            }
          } else {
            throw new Error("Failed to get user data");
          }
        } catch (err) {
          console.error("OAuth callback error:", err);
          toast({
            title: "Authentication Error",
            description: "Failed to complete sign-in. Please try again.",
            variant: "destructive",
          });
          navigate("/", { replace: true });
        }
      } else if (status === "failure") {
        let errorMessage = "Authentication failed. Please try again.";
        
        if (error === "no_workspace") {
          errorMessage = "Authentication failed: No workspace found for your account.";
        } else if (error === "user_not_found") {
          errorMessage = "Authentication failed: User not found.";
        }

        toast({
          title: "Authentication Failed",
          description: errorMessage,
          variant: "destructive",
        });

        setTimeout(() => {
          navigate("/", { replace: true });
        }, 2000);
      } else {
        navigate("/", { replace: true });
      }
    };

    handleCallback();
  }, [status, error, workspaceId, navigate]);

  return (
    <div className="flex min-h-svh flex-col items-center justify-center gap-6 bg-gradient-to-br from-slate-100 via-gray-50 to-slate-200 backdrop-blur-sm p-6 md:p-10 dark:from-slate-800 dark:via-slate-900 dark:to-slate-800">
      <div className="flex w-full max-w-sm flex-col gap-6">
        <div className="flex items-center gap-2 self-center font-medium">
          <Logo />
          Flowmatic
        </div>
        <Card>
          <CardContent className="p-6">
            <div className="text-center">
              {status === "success" ? (
                <div>
                  <h2 className="text-xl font-semibold mb-2">Success!</h2>
                  <p className="text-muted-foreground mb-4">
                    Successfully signed in with Google. Redirecting to your workspace...
                  </p>
                  <Loader className="mx-auto animate-spin h-5 w-5" />
                </div>
              ) : status === "failure" ? (
                <div>
                  <h2 className="text-xl font-semibold mb-2">Authentication Failed</h2>
                  <p className="text-muted-foreground mb-4">
                    {error === "no_workspace" 
                      ? "No workspace found for your account."
                      : error === "user_not_found"
                      ? "User not found."
                      : "We couldn't sign you in with Google."}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Redirecting back to sign-in...
                  </p>
                  <Loader className="mx-auto animate-spin h-5 w-5 mt-2" />
                </div>
              ) : (
                <div>
                  <h2 className="text-xl font-semibold mb-2">Processing...</h2>
                  <p className="text-muted-foreground mb-4">
                    Completing your Google sign-in...
                  </p>
                  <Loader className="mx-auto animate-spin h-5 w-5" />
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default GoogleOAuthCallback;
