import Card from './Card';

export default function TenCards({ tensCaptured, teamScores }) {
  return (
    <div className="bg-white rounded-lg shadow-lg p-4">
      <h3 className="text-lg font-bold mb-4 text-center">Captured Tens</h3>
      
      <div className="space-y-4">
        {/* Team A */}
        <div className="bg-blue-50 rounded-lg p-3">
          <div className="flex items-center justify-between mb-2">
            <span className="font-semibold text-blue-800">Team A</span>
            <span className="text-sm text-gray-600">{teamScores.teamA} rounds won</span>
          </div>
          <div className="flex gap-2 flex-wrap">
            {tensCaptured.teamA && tensCaptured.teamA.length > 0 ? (
              tensCaptured.teamA.map((card, idx) => (
                <div key={idx} className="transform scale-75">
                  <Card card={card} />
                </div>
              ))
            ) : (
              <div className="text-gray-400 text-sm">No tens captured yet</div>
            )}
          </div>
        </div>

        {/* Team B */}
        <div className="bg-red-50 rounded-lg p-3">
          <div className="flex items-center justify-between mb-2">
            <span className="font-semibold text-red-800">Team B</span>
            <span className="text-sm text-gray-600">{teamScores.teamB} rounds won</span>
          </div>
          <div className="flex gap-2 flex-wrap">
            {tensCaptured.teamB && tensCaptured.teamB.length > 0 ? (
              tensCaptured.teamB.map((card, idx) => (
                <div key={idx} className="transform scale-75">
                  <Card card={card} />
                </div>
              ))
            ) : (
              <div className="text-gray-400 text-sm">No tens captured yet</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
