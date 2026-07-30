import Link from 'next/link'

export default function UpgradePage() {
  const plans = [
    { name: 'Free', price: '$0', features: ['5 snippets', 'Public repos', 'Syntax highlighting'], cta: 'Current plan', disabled: true },
    { name: 'Pro', price: '$15', features: ['50 snippets', 'Private repos', 'Remove branding', 'Priority support'], cta: 'Upgrade to Pro', highlight: true },
    { name: 'Team', price: '$99', features: ['Unlimited snippets', 'Team access', 'Analytics', 'Dedicated support'], cta: 'Contact us' },
  ]

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white text-center mb-8">Choose your plan</h1>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {plans.map(plan => (
            <div key={plan.name} className={`rounded-xl border ${plan.highlight ? 'border-indigo-500 shadow-lg' : 'border-gray-200 dark:border-gray-700'} bg-white dark:bg-gray-800 p-6 flex flex-col`}>
              <div className="flex-1">
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">{plan.name}</h2>
                <p className="text-3xl font-bold text-gray-900 dark:text-white mb-4">{plan.price}<span className="text-sm font-normal text-gray-500">/month</span></p>
                <ul className="space-y-2 mb-6">
                  {plan.features.map(f => (
                    <li key={f} className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300">
                      <svg className="h-4 w-4 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                      {f}
                    </li>
                  ))}
                </ul>
              </div>
              <button
                disabled={plan.disabled}
                className={`w-full py-2 px-4 rounded-lg text-sm font-medium ${plan.disabled ? 'bg-gray-100 text-gray-400 dark:bg-gray-700 dark:text-gray-500 cursor-not-allowed' : 'bg-indigo-600 text-white hover:bg-indigo-500'}`}
              >
                {plan.cta}
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}