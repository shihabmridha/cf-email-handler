import { Button } from "@/components/ui/button"

const dummyDrafts = [
  { id: 1, subject: "Important Meeting Notes", date: "2023-05-15" },
  { id: 2, subject: "Project Proposal", date: "2023-05-14" },
  { id: 3, subject: "Weekly Update", date: "2023-05-13" },
  { id: 4, subject: "Client Feedback", date: "2023-05-12" },
  { id: 5, subject: "Team Outing Plan", date: "2023-05-11" },
]

export default function DraftPage() {
  return (
    <div className="p-6 space-y-4 max-w-5xl mx-auto">
      <h1 className="text-2xl font-bold">Drafts</h1>
      <div className="space-y-2">
        {dummyDrafts.map((draft) => (
          <div key={draft.id} className="flex items-center justify-between p-4 bg-white rounded-lg shadow">
            <div>
              <h3 className="font-semibold">{draft.subject}</h3>
              <p className="text-sm text-gray-500">Last edited: {draft.date}</p>
            </div>
            <Button variant="outline">Edit</Button>
          </div>
        ))}
      </div>
    </div>
  )
}

