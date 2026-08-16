import { useToastContext } from "@/context/toast-context";

export function useToast() {
    const { showToast } = useToastContext();
    return { toast: showToast };
}
