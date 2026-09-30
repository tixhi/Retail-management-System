import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { KeyRound, LockKeyhole, Mail, UserRound } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export default function LoginPage() {
  const navigate = useNavigate();
  const { login, registerAdmin } = useAuth();
  const [isSignup, setIsSignup] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [inviteCode, setInviteCode] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setError('');

    try {
      const payload = isSignup
        ? await registerAdmin({ name, email, password, inviteCode })
        : await login(email, password);
      const destination = payload?.user?.role === 'Customer' ? '/catalog' : '/dashboard';
      navigate(destination);
    } catch (err) {
      setError(err?.response?.data?.message || (isSignup ? 'Admin signup failed.' : 'Login failed.'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-100 px-4 py-8">
      <div className="grid w-full max-w-5xl overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-soft lg:grid-cols-[1.1fr_0.9fr]">
        <div className="hidden bg-slate-950 p-10 text-white lg:flex lg:flex-col lg:justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-slate-400">Retail Operations</p>
            <h1 className="mt-6 text-4xl font-semibold">Inventory Hub</h1>
          </div>
          <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-5">
            <p className="text-sm text-slate-300">Monitor stock, orders, warehouses, suppliers, and fulfillment from a single platform.</p>
          </div>
        </div>

        <div className="p-6 sm:p-8">
          <div className="mb-8">
            <p className="text-sm font-medium text-blue-600">{isSignup ? 'Administrator access' : 'Welcome back'}</p>
            <h2 className="mt-2 text-3xl font-bold text-slate-900">{isSignup ? 'Create admin account' : 'Sign in'}</h2>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {isSignup ? (
              <div>
                <label htmlFor="signup-name" className="mb-2 block text-sm font-medium text-slate-700">Full name</label>
                <div className="relative">
                  <UserRound className="pointer-events-none absolute left-3 top-3 text-slate-400" size={18} />
                  <input id="signup-name" className="input pl-10" value={name} onChange={(event) => setName(event.target.value)} required maxLength={100} autoComplete="name" />
                </div>
              </div>
            ) : null}
            <div>
              <label htmlFor="auth-email" className="mb-2 block text-sm font-medium text-slate-700">Email address</label>
              <div className="relative">
                <Mail className="pointer-events-none absolute left-3 top-3 text-slate-400" size={18} />
                <input id="auth-email" className="input pl-10" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required autoComplete="email" />
              </div>
            </div>

            <div>
              <label htmlFor="auth-password" className="mb-2 block text-sm font-medium text-slate-700">{isSignup ? 'Password (12 characters minimum)' : 'Password'}</label>
              <div className="relative">
                <LockKeyhole className="pointer-events-none absolute left-3 top-3 text-slate-400" size={18} />
                <input id="auth-password" className="input pl-10" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required minLength={isSignup ? 12 : undefined} autoComplete={isSignup ? 'new-password' : 'current-password'} />
              </div>
            </div>

            {isSignup ? (
              <div>
                <label htmlFor="admin-invite-code" className="mb-2 block text-sm font-medium text-slate-700">Admin invite code</label>
                <div className="relative">
                  <KeyRound className="pointer-events-none absolute left-3 top-3 text-slate-400" size={18} />
                  <input id="admin-invite-code" className="input pl-10" type="password" value={inviteCode} onChange={(event) => setInviteCode(event.target.value)} required autoComplete="one-time-code" />
                </div>
              </div>
            ) : null}

            {error ? <div className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">{error}</div> : null}

            <button type="submit" className="btn-primary w-full" disabled={loading}>
              {loading ? (isSignup ? 'Creating account...' : 'Signing in...') : (isSignup ? 'Create admin account' : 'Sign in')}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-slate-600">
            {isSignup ? 'Already have an account?' : 'New administrator?'}{' '}
            <button
              type="button"
              className="font-semibold text-blue-700 hover:text-blue-900"
              onClick={() => {
                setIsSignup((current) => !current);
                setError('');
              }}
            >
              {isSignup ? 'Sign in' : 'Sign up'}
            </button>
          </p>

        </div>
      </div>
    </div>
  );
}
