import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Loader2, Shield } from "lucide-react";
import { useInternetIdentity } from "../hooks/useInternetIdentity";

interface LoginModalProps {
  open: boolean;
  onClose: () => void;
}

export default function LoginModal({ open, onClose }: LoginModalProps) {
  const { login, loginStatus } = useInternetIdentity();
  const isLoggingIn = loginStatus === "logging-in";

  const handleLogin = async () => {
    try {
      await login();
      onClose();
    } catch (err: any) {
      console.error("Login error:", err);
    }
  };

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent
        className="max-w-sm bg-card border-glow-cyan text-center"
        data-ocid="login.dialog"
      >
        <DialogHeader>
          <div className="flex justify-center mb-3">
            <div className="w-16 h-16 rounded-full bg-primary/10 border border-cyan/30 flex items-center justify-center glow-cyan">
              <Shield className="w-8 h-8 text-cyan" />
            </div>
          </div>
          <DialogTitle className="text-xl font-bold gradient-text-cyan">
            Admin Login
          </DialogTitle>
          <DialogDescription className="text-muted-foreground text-sm">
            Sign in with Internet Identity to access admin features.
          </DialogDescription>
        </DialogHeader>

        <div className="py-2">
          <Button
            onClick={handleLogin}
            disabled={isLoggingIn}
            className="w-full rounded-full bg-primary text-primary-foreground glow-cyan font-semibold uppercase tracking-wider"
            data-ocid="login.submit_button"
          >
            {isLoggingIn ? (
              <>
                <Loader2 className="mr-2 w-4 h-4 animate-spin" /> Logging in...
              </>
            ) : (
              "Sign In with Internet Identity"
            )}
          </Button>
        </div>

        <Button
          variant="ghost"
          size="sm"
          onClick={onClose}
          className="text-muted-foreground"
          data-ocid="login.cancel_button"
        >
          Cancel
        </Button>
      </DialogContent>
    </Dialog>
  );
}
