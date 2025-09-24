import { Toast, ToastDescription, ToastTitle, useToast } from "@/components/ui/toast";

type ToastData = {
    // ID: string,
    title: string,
    description: string,
    duration: number,
}

export function createHandleToast(toastData: ToastData) {
    const toast = useToast();
    const ID = Math.random().toString();

    const showToast = () => {
        toast.show({
            // id: toastData.ID,
            id: ID,
            placement: 'top',
            duration: toastData.duration,
            render: ({ id }) => {
                const uniqueToastId = 'toast-' + id;
                return (
                    <Toast style= {{ marginTop: 50 } } nativeID={ uniqueToastId } action="info" variant="solid" >
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