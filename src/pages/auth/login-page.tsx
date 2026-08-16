import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";

import { SignInPage, type SignInFormValues } from "@/components/ui/sign-in";
import { useAuth } from "@/hooks/use-auth";
import { HttpError } from "@/api/http-client";

function getErrorMessage(error: unknown) {
    return error instanceof HttpError || error instanceof Error
        ? error.message
        : "Unable to sign in. Please check your credentials and try again.";
}

export function LoginPage() {
    const { login } = useAuth();
    const navigate = useNavigate();

    const signIn = useMutation({
        mutationFn: async (values: SignInFormValues) => {
            return await login({
                email: values.email,
                password: values.password,
            });
        },
        onSuccess: () => {
            navigate("/overview", { replace: true });
        },
    });

    return (
        <SignInPage
            error={signIn.isError ? getErrorMessage(signIn.error) : undefined}
            isSubmitting={signIn.isPending}
            onSubmit={values => signIn.mutate(values)}
            success={signIn.isSuccess ? "Signed in successfully. Redirecting…" : undefined}
        />
    );
}
