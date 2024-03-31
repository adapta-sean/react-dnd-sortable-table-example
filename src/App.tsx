import './App.css'
import TableExample from "./TableExample.tsx";
import SwrExample from "./SwrExample.tsx";

function App() {
    return (
        <>
            <h1 className='mb-8 text-lg'>React Drag and Drop Table Example</h1>
            <div className='flex flex-col gap-4'>
                <h2 className='mb-4 text-lg'>Flowbite Table with state</h2>
                <TableExample/>
                <h2 className='mb-4 text-lg'>Flowbite Table with SWR optimistic updates and rollback on failure</h2>
                <SwrExample/>
            </div>
        </>
    );
}

export default App
