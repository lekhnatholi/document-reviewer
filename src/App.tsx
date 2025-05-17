import { useState, useEffect } from 'react'
import 'bootstrap/dist/css/bootstrap.min.css'
import './styles/main.scss'
import Sidebar from './components/Sidebar'
import DocumentPreviewer from './components/DocumentPreviewer'
import ConfirmModal from './components/ConfirmModal'
import ApprovedModal from './components/ApprovedModal'
import sectionsData from './data/sections.json'

function App() {
  const section = sectionsData.data.sections[0]
  const initialFields = section.children.filter((f: any) => f.content)
  const [selectedIds, setSelectedIds] = useState<number[]>(
  )
  const [fields, setFields] = useState(initialFields)
  const [hoveredId, setHoveredId] = useState<number | undefined>(undefined)
  const [showConfirm, setShowConfirm] = useState(false)
  const [showApproved, setShowApproved] = useState(false)

  // Remove field handler
  const handleRemove = (id: number) => {
    setFields(fields.filter((f: any) => f.content && f.id !== id))
    if(selectedIds?.length) setSelectedIds(selectedIds.filter((sid) => sid !== id))
  }

  // Toggle select
  const handleToggle = (id: number) => {
    setSelectedIds((prev) => {
      prev = prev ?? [];
      return prev.includes(id) ? prev.filter((sid) => sid !== id) : [...prev, id];
    });
  }

  // Select all
  const handleSelectAll = () => {
    if (selectedIds?.length === fields.length) {
      setSelectedIds([])
    } else {
      setSelectedIds(fields.map((f: any) => f.id))
    }
  }

  // Confirm logic
  const handleConfirm = () => setShowConfirm(true)
  const handleConfirmModal = () => {
    setShowConfirm(false)
    setShowApproved(true)
  }
  const handleCloseApproved = () => setShowApproved(false)

  // Update fields if removed
  useEffect(() => {
    setSelectedIds((prev) => prev?.filter((id) => fields.some((f: any) => f.id === id)))
  }, [fields])

  return (
    <div className="app-container">
      <header className="header">
        <h1>Document Review</h1>
      </header>
      <main className="main-content">
        <div className='row'>
          <div className='col-md-8'>
            <DocumentPreviewer
              fields={fields.filter((f: any) => f.content)}
              selectedIds={selectedIds}
              hoveredId={hoveredId}
              onHover={setHoveredId}
            />
          </div>
          <div className='col-md-4'>
            <Sidebar
              section={{ ...section, children: fields }}
              selectedIds={selectedIds}
              onToggle={handleToggle}
              onRemove={handleRemove}
              onSelectAll={handleSelectAll}
              allSelected={selectedIds?.length === fields.length && fields.length > 0}
              onHover={setHoveredId}
              onConfirm={handleConfirm}
            />
          </div>

        </div>

        <ConfirmModal
          show={showConfirm}
          onConfirm={handleConfirmModal}
          onCancel={() => setShowConfirm(false)}
          selectedCount={selectedIds?.length || 0}
        />
        <ApprovedModal
          show={showApproved}
          onClose={handleCloseApproved}
        />
      </main>
    </div>
  )
}

export default App
