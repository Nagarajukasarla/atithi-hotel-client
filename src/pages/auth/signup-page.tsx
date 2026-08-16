import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";

import { SignUpPage, type SignUpFormValues } from "@/components/ui/sign-up";
import { useAuth } from "@/hooks/use-auth";
import { HttpError } from "@/api/http-client";

function getErrorMessage(error: unknown) {
    return error instanceof HttpError || error instanceof Error
        ? error.message
        : "Unable to create your account. Please try again.";
}

export function SignupPage() {
    const { signup } = useAuth();
    const navigate = useNavigate();

    const signUp = useMutation({
        mutationFn: async (values: SignUpFormValues) => {
            return await signup({
                hotelName: values.hotelName,
                ownerName: values.ownerName,
                email: values.email,
                password: values.password,
                phone: values.phone,
                city: values.city,
                state: values.state,
                country: values.country,
                postalCode: values.postalCode,
            });
        },
        onSuccess: () => {
            navigate("/overview", { replace: true });
        },
    });

    return (
        <SignUpPage
            error={signUp.isError ? getErrorMessage(signUp.error) : undefined}
            isSubmitting={signUp.isPending}
            onSubmit={values => signUp.mutate(values)}
            success={signUp.isSuccess ? "Hotel account registered successfully. Redirecting…" : undefined}
        />
    );
}
