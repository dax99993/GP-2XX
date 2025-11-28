import { Toast, ToastDescription, ToastTitle, useToast } from "@/components/ui/toast";
import { ToastPlacement } from "@gluestack-ui/toast/lib/types";

type ToastData = {
    // ID: string,
    title: string,
    description: string,
    duration: number,
}

export function createHandleToast(
    toastData: ToastData,
    placement: ToastPlacement = 'top', 
    action: "error" | "info" | "warning" = "info"
) {
    const toast = useToast();
    const ID = Math.random().toString();

    const showToast = () => {
        toast.show({
            // id: toastData.ID,
            id: ID,
            placement: placement,
            duration: toastData.duration,
            render: ({ id }) => {
                const uniqueToastId = 'toast-' + id;
                return (
                    <Toast style= {{ marginTop: 50, marginBottom: 100 } } nativeID={ uniqueToastId } action={action} variant="solid" >
                        <ToastTitle>{toastData.title}</ ToastTitle >
                        <ToastDescription>
                            {toastData.description}
                        </ToastDescription>
                    </Toast>
                );
            },
        });
    }

    const handleToast = () => {
        if (!toast.isActive(ID)) {
            showToast();
        }
    };

    return handleToast;
}