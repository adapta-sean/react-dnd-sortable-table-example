# React Drag and Drop Sortable Table example

This code demonstrates a React application featuring a draggable and sortable table, leveraging `@dnd-kit/core` and `@dnd-kit/sortable` for drag-and-drop functionality and `flowbite-react` for UI components. It allows users to reorder rows in a table through drag-and-drop interactions.

1. **User Data Structure**: A `User` type is defined with `id`, `name`, and `email` fields, and an array of user objects is provided as the dataset for the table.

2. **Drag-and-Drop Setup**: The application uses the `DndContext` component from `@dnd-kit/core` to create a drag-and-drop context. It employs various sensors (`PointerSensor`, `TouchSensor`, and `KeyboardSensor`) to handle drag operations across different input methods.

3. **Sorting Capability**: Inside the `DndContext`, the `SortableContext` component specifies the list of items as sortable using a vertical list strategy. Each table row is rendered as a `SortableItem` component, which manages the drag-and-drop state for that row using the `useSortable` hook.

4. **Drag End Handling**: A function called `handleDragEnd` is used to update the items' order upon completing a drag operation. It calculates the new order by rearranging the items array, thus updating the list's state to reflect the changes.

This setup provides an interactive way for users to reorder table rows using drag-and-drop, integrating smoothly with React's state management and rendering mechanisms.