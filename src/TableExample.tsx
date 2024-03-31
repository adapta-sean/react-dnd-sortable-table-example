import {Table} from "flowbite-react";
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
import {useEffect, useState} from "react";

type User = { id: number, name: string, email: string };

const users = [
    {id: 1, name: "Jake", email: "j.jackson@example.com", sortOrder: 0},
    {id: 2, name: "Jenny", email: "j.jenkins@example.com", sortOrder: 1},
    {id: 3, name: "Jose", email: "j.jobson@example.com", sortOrder: 2},
    {id: 4, name: "Jill", email: "j.jamesone@example.com", sortOrder: 3},
    {id: 5, name: "John", email: "j.jefferson@example.com", sortOrder: 4},
    {id: 6, name: "Jacob", email: "j.jones@example.com", sortOrder: 5},
    {id: 7, name: "Jade", email: "j.jennings@example.com", sortOrder: 6},
];

function SortableItem({user}: { user: User }) {
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

export default function TableExample() {
    const [items, setItems] = useState(users.sort((a, b) => a.sortOrder - b.sortOrder));

    const sensors = useSensors(
        useSensor(PointerSensor),
        useSensor(TouchSensor),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates,
        })
    );

    const handleDragEnd = (event: DragEndEvent) => {
        const {active, over} = event;
        if (!active.id || !over?.id) return;
        if (active.id !== over.id) {
            setItems((items) => {
                const oldIndex = items.findIndex(item => item.id === active.id);
                const newIndex = items.findIndex(item => item.id === over.id);

                return arrayMove(items, oldIndex, newIndex);
            });
        }
    };

    useEffect(() => {
        console.log('save new order', items.map((item, i) => ({...item, sortOrder: i})))
    }, [items]);

    return (
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
                        items={items}
                        strategy={verticalListSortingStrategy}
                    >
                        {items.map(user => <SortableItem key={user.id} user={user}/>)}
                    </SortableContext>
                </Table.Body>
            </Table>
        </DndContext>
    );
}
