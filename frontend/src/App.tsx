import ClientList from "./components/ClientList"

function App() {
  return (
    <main className="container mx-auto py-10 px-4">
      <div className="flex flex-col gap-8">
        <header className="text-center">
          <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl">
            VetOS
          </h1>
          <p className="text-xl text-muted-foreground mt-2">
            Modern Veterinary Practice Management
          </p>
        </header>
        
        <ClientList />
      </div>
    </main>
  )
}

export default App
