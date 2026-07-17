// fichier gerant le component liste/tableau des logs

// import
// icone
import { Trash2, AlertCircle, Info, AlertTriangle } from "lucide-react";

export default function LogDataGrid({ logs, handleDelete }) {

    // helper pour generer icone selon type de log
    const getLogStyle = (type) => {
        switch (type) {
            case 'erreur':
                return { icon: AlertCircle, color: 'bg-red-100 text-red-700' };
            case 'alerte':
                return { icon: AlertTriangle, color: 'bg-orange-100 text-orange-700' };
            case 'info':
            default:
                return { icon: Info, color: 'bg-blue-100 text-blue-700' };
        }
    };

    return (
        <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
                <thead>
                    <tr className="border-b border-white/40 text-primary-dark/70 text-sm">
                        <th className="py-4 px-4 font-semibold">Date</th>
                        <th className="py-4 px-4 font-semibold">Type</th>
                        <th className="py-4 px-4 font-semibold">Message</th>
                        <th className="py-4 px-4 font-semibold text-right">Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {logs.length > 0 ? (
                        logs.map((log) => {
                            const Style = getLogStyle(log.type);
                            const Icon = Style.icon;

                            return (
                                <tr
                                    key={log.id}
                                    className="border-b border-white/20 hover:bg-white/30 transition-colors"
                                >
                                    <td className="py-4 px-4 text-sm font-medium text-primary-dark/70 whitespace-nowrap">
                                        {log.date}
                                    </td>
                                    <td className="py-4 px-4">
                                        <span className={`px-2 py-1 rounded-md text-xs font-medium flex items-center gap-1 w-fit capitalize ${Style.color}`}>
                                            <Icon className="w-3 h-3" />
                                            {log.type}
                                        </span>
                                    </td>
                                    <td className="py-4 px-4 text-primary-dark font-medium flex items-center gap-2">
                                        {log.message}
                                    </td>
                                    <td className="py-4 px-4 text-right">
                                        <button
                                            onClick={() => handleDelete(log.id)}
                                            title="Supprimer ce log"
                                            className="p-2 inline-flex rounded-lg bg-red-100 text-red-600 hover:bg-red-200 transition-colors"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    </td>
                                </tr>
                            )
                        })
                    ) : (
                        <tr>
                            <td colSpan="4" className="py-8 text-center text-primary-dark/60">
                                Aucun log trouvé. Le système est propre !
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    );
}