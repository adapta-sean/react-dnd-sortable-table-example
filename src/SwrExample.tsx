import {Table, Toast} from "flowbite-react";
import {
    closestCenter,
    DndContext,
    DragEndEvent,
    KeyboardSensor,
    PointerSensor,
    TouchSensor,
    useSensor,
    useSensors,
} from '@dnd-kit/core';
import {
    arrayMove,
    SortableContext,
    sortableKeyboardCoordinates,
    useSortable,
    verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import {CSS} from '@dnd-kit/utilities';
import useSWR, {useSWRConfig} from "swr";
import {useState} from "react";
import {HiFire} from "react-icons/hi";

type UserRow = { id: number, name: string, email: string, sortOrder: number };

class UsersApi {
    users: UserRow[] = [
        {id: 1, name: "Jake", email: "j.jackson@example.com", sortOrder: 0},
        {id: 2, name: "Jenny", email: "j.jenkins@example.com", sortOrder: 1},
        {id: 3, name: "Jose", email: "j.jobson@example.com", sortOrder: 2},
        {id: 4, name: "Jill", email: "j.jamesone@example.com", sortOrder: 3},
        {id: 5, name: "John", email: "j.jefferson@example.com", sortOrder: 4},
        {id: 6, name: "Jacob", email: "j.jones@example.com", sortOrder: 5},
        {id: 7, name: "Jade", email: "j.jennings@example.com", sortOrder: 6},
    ];

    get(): Promise<UserRow[]> {
        return Promise.resolve([...this.users])
    }

    put(data: UserRow[]): Promise<void> {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                if (Math.random() > 0.9) {
                    reject('Update failed');
                    return;
                }
                this.users = [...data];
                resolve();
            }, 1000);
        });
    }

}

const usersApi = new UsersApi();

function SortableItem({user}: { user: UserRow }) {
    const {
        attributes,
        listeners,
        setNodeRef,
        setActivatorNodeRef,
        transform,
        transition,
        isDragging
    } = useSortable({id: user.id});

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        zIndex: isDragging ? '2' : '1',
        boxShadow: isDragging ? '3px 3px 4px rgba(0, 0, 0, 0.2)' : ''
    };

    if (!user) return null;

    return (
        <Table.Row ref={setNodeRef} style={style} className='bg-white relative'>
            <Table.Cell>{user.name}</Table.Cell>
            <Table.Cell>{user.email}</Table.Cell>
            <Table.Cell ref={setActivatorNodeRef} {...listeners} {...attributes}
                        className='w-[60px] hover:text-slate-800'>
                <svg
                    className='w-4 h-4 ml-auto'
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 320 512"
                >
                    <path
                        fill='currentColor'
                        d="M40 352l48 0c22.1 0 40 17.9 40 40l0 48c0 22.1-17.9 40-40 40l-48 0c-22.1 0-40-17.9-40-40l0-48c0-22.1 17.9-40 40-40zm192 0l48 0c22.1 0 40 17.9 40 40l0 48c0 22.1-17.9 40-40 40l-48 0c-22.1 0-40-17.9-40-40l0-48c0-22.1 17.9-40 40-40zM40 320c-22.1 0-40-17.9-40-40l0-48c0-22.1 17.9-40 40-40l48 0c22.1 0 40 17.9 40 40l0 48c0 22.1-17.9 40-40 40l-48 0zM232 192l48 0c22.1 0 40 17.9 40 40l0 48c0 22.1-17.9 40-40 40l-48 0c-22.1 0-40-17.9-40-40l0-48c0-22.1 17.9-40 40-40zM40 160c-22.1 0-40-17.9-40-40L0 72C0 49.9 17.9 32 40 32l48 0c22.1 0 40 17.9 40 40l0 48c0 22.1-17.9 40-40 40l-48 0zM232 32l48 0c22.1 0 40 17.9 40 40l0 48c0 22.1-17.9 40-40 40l-48 0c-22.1 0-40-17.9-40-40l0-48c0-22.1 17.9-40 40-40z"/>
                </svg>
            </Table.Cell>
        </Table.Row>
    )
}

let timer: number;

export default function SwrExample() {
    const [toast, setToast] = useState('');
    const {mutate} = useSWRConfig();
    const {data, error, isLoading} = useSWR<UserRow[]>('/api/user', async () => await usersApi.get());

    const sensors = useSensors(
        useSensor(PointerSensor),
        useSensor(TouchSensor),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates,
        })
    );

    const handleDragEnd = async (event: DragEndEvent) => {
        const {active, over} = event;
        if (!data || !active.id || !over?.id) return;
        if (active.id !== over.id) {
            const oldIndex = data.findIndex(item => item.id === active.id);
            const newIndex = data.findIndex(item => item.id === over.id);
            const newOrder = arrayMove(data, oldIndex, newIndex);
            await mutate(
                '/api/user',
                usersApi.put(newOrder)
                    .then(() => newOrder)
                    .catch(() => {
                        setToast('Failed to update order');
                        clearTimeout(timer);
                        timer = setTimeout(() => {
                            setToast('');
                        }, 2000);
                        return data;
                    }),
                {
                    rollbackOnError: true,
                    optimisticData: newOrder
                }
            );
        }
    };

    if (isLoading) return <p>Loading…</p>;
    if (error) return <p>{JSON.stringify(error)}</p>;
    if (!data || !data.length) return <p>No Items</p>;

    return (
        <>
            <DndContext
                sensors={sensors}
                collisionDetection={closestCenter}
                onDragEnd={handleDragEnd}
            >
                <Table>
                    <Table.Head>
                        <Table.HeadCell>Name</Table.HeadCell>
                        <Table.HeadCell>Email</Table.HeadCell>
                        <Table.HeadCell>&nbsp;</Table.HeadCell>
                    </Table.Head>
                    <Table.Body className="divide-y bg-slate-300">
                        <SortableContext
                            items={data.map(item => item.id)}
                            strategy={verticalListSortingStrategy}
                        >
                            {data.map(user => <SortableItem key={user.id} user={user}/>)}
                        </SortableContext>
                    </Table.Body>
                </Table>
            </DndContext>
            {toast ? (
                <Toast className='absolute top-10 right-10 z-10'>
                    <div
                        className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-red-100 text-red-500 dark:bg-red-800 dark:text-red-200">
                        <HiFire className="h-5 w-5"/>
                    </div>
                    <div className="ml-3 text-sm font-normal">{toast}</div>
                    <Toast.Toggle onDismiss={() => setToast('')}/>
                </Toast>
            ) : null}
        </>
    );
}
