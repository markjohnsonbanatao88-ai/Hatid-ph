'use client';

import { useState, type CSSProperties, type FocusEvent, type ReactNode } from 'react';
import {
  ArrowLeft,
  ArrowRight,
  Bell,
  Bike,
  Briefcase,
  Car,
  Check,
  Clock,
  CreditCard,
  HelpCircle,
  Home,
  MapPin,
  Phone,
  Search,
  Settings,
  Shield,
  Star,
  User,
  Wallet,
  type LucideIcon,
} from 'lucide-react';

import { HatidIconTile, HatidWordmark } from '@/components/hatid-brand';
import {
  AppHeader,
  Badge,
  BottomNav,
  BottomSheet,
  Button,
  Card,
  DriverCard,
  LocationCard,
  MapPreview,
  RideCard,
  SafetyCard,
} from '@/components/hatid-ui';

type Screen =
  | 'splash'
  | 'login'
  | 'otp'
  | 'profile'
  | 'permissions'
  | 'home'
  | 'book-search'
  | 'book-choose'
  | 'book-active'
  | 'book-completed'
  | 'trips'
  | 'wallet'
  | 'safety'
  | 'account';

type RideType = 'car' | 'moto';

const navItems: { id: Screen; label: string; icon: LucideIcon }[] = [
  { id: 'home', label: 'Home', icon: Home },
  { id: 'trips', label: 'Trips', icon: Clock },
  { id: 'wallet', label: 'Wallet', icon: Wallet },
  { id: 'safety', label: 'Safety', icon: Shield },
  { id: 'account', label: 'Account', icon: User },
];

const eyebrow: CSSProperties = {
  fontSize: 'var(--text-caption)',
  fontWeight: 'var(--weight-black)' as unknown as number,
  textTransform: 'uppercase',
  letterSpacing: 'var(--tracking-eyebrow)',
  color: 'var(--text-faint)',
};

const heading: CSSProperties = {
  fontSize: 'var(--text-title)',
  fontWeight: 'var(--weight-black)' as unknown as number,
  letterSpacing: 'var(--tracking-tight)',
  color: 'var(--hatid-ink)',
};

const bodyMuted: CSSProperties = {
  marginTop: '0.5rem',
  fontSize: 'var(--text-label)',
  lineHeight: 'var(--leading-body)',
  color: 'var(--text-muted)',
};

function fieldFocus(on: boolean) {
  return (event: FocusEvent<HTMLElement>) => {
    event.currentTarget.style.borderColor = on ? 'var(--hatid-primary)' : 'var(--hatid-border-strong)';
    event.currentTarget.style.boxShadow = on ? 'var(--shadow-focus)' : 'none';
  };
}

function PhoneFrame({
  children,
  showNav,
  current,
  go,
}: {
  children: ReactNode;
  showNav: boolean;
  current: Screen;
  go: (screen: Screen) => void;
}) {
  return (
    <main className="flex min-h-screen items-center justify-center font-sans sm:p-6" style={{ background: '#0b1220', color: 'var(--text-primary)' }}>
      <div
        className="relative flex h-[100dvh] w-full flex-col overflow-hidden sm:h-[844px] sm:max-w-[390px] sm:rounded-[2.5rem] sm:border-[8px] sm:border-slate-900"
        style={{ background: 'var(--surface-canvas)', boxShadow: '0 40px 80px -32px rgb(0 0 0 / 0.6)' }}
      >
        <div className="absolute left-1/2 top-0 z-[100] hidden h-[25px] w-[120px] -translate-x-1/2 items-center justify-center rounded-b-[18px] bg-slate-900 sm:flex">
          <div className="h-1 w-12 rounded-full bg-black/40" />
        </div>
        <div className="relative flex-1 overflow-hidden">{children}</div>
        {showNav && (
          <BottomNav
            activeId={current}
            onNavigate={(id) => go(id as Screen)}
            items={navItems.map(({ id, label, icon: Icon }) => ({
              id,
              label,
              icon: <Icon size={21} strokeWidth={id === current ? 2.5 : 2} />,
            }))}
          />
        )}
      </div>
    </main>
  );
}

function Splash({ go }: { go: (screen: Screen) => void }) {
  return (
    <section className="flex h-full flex-col px-6 pb-10 pt-20" style={{ background: 'var(--hatid-ink)', color: 'var(--text-inverse)' }}>
      <div className="flex flex-1 items-center justify-center">
        <HatidWordmark light large tagline="Biyahe natin. Bansa natin." />
      </div>
      <Card padding="lg" style={{ boxShadow: 'var(--shadow-elevated)' }}>
        <Badge variant="info">Philippine mobility prototype</Badge>
        <h1 className="mt-4" style={{ ...heading, fontSize: 'var(--text-display)' }}>Ride with confidence.</h1>
        <p style={bodyMuted}>A lightweight passenger preview for safe city trips, family rides, and everyday commutes. Nothing here is a live ride.</p>
        <Button fullWidth onClick={() => go('login')} style={{ marginTop: '1.5rem' }}>
          Get started <ArrowRight size={18} />
        </Button>
      </Card>
    </section>
  );
}

function Login({ go, phone, setPhone }: { go: (screen: Screen) => void; phone: string; setPhone: (value: string) => void }) {
  const valid = phone.replace(/\D/g, '').length >= 10;
  return (
    <section className="flex h-full flex-col px-6 pt-14" style={{ background: 'var(--surface-raised)' }}>
      <Button variant="ghost" size="icon" onClick={() => go('splash')} aria-label="Go back" style={{ marginBottom: '2rem' }}>
        <ArrowLeft size={22} />
      </Button>
      <HatidWordmark compact tagline="Secure sign in" />
      <h1 className="mt-8" style={heading}>Enter your mobile number</h1>
      <p style={bodyMuted}>We&apos;ll send a one-time code. Demo only, no real SMS is sent.</p>
      <div
        className="mt-8 flex overflow-hidden"
        style={{ borderRadius: 'var(--radius-control)', border: '1px solid var(--hatid-border-strong)', transition: 'border-color 140ms ease, box-shadow 140ms ease' }}
        onFocus={fieldFocus(true)}
        onBlur={fieldFocus(false)}
      >
        <div className="flex items-center px-4 py-4 text-sm font-black" style={{ borderRight: '1px solid var(--hatid-border)', background: 'var(--surface-muted)', color: 'var(--text-secondary)' }}>+63</div>
        <input
          value={phone}
          onChange={(event) => setPhone(event.target.value)}
          type="tel"
          placeholder="9XX XXX XXXX"
          maxLength={10}
          className="w-full px-4 py-4 font-bold outline-none"
          style={{ background: 'transparent', color: 'var(--text-primary)' }}
        />
      </div>
      <Button fullWidth disabled={!valid} onClick={() => go('otp')} style={{ marginTop: 'auto', marginBottom: '2rem' }}>
        Continue
      </Button>
    </section>
  );
}

function Otp({ go, otp, setOtp }: { go: (screen: Screen) => void; otp: string; setOtp: (value: string) => void }) {
  const valid = otp.replace(/\D/g, '').length >= 6;
  return (
    <section className="flex h-full flex-col px-6 pt-14" style={{ background: 'var(--surface-raised)' }}>
      <Button variant="ghost" size="icon" onClick={() => go('login')} aria-label="Go back" style={{ marginBottom: '2rem' }}>
        <ArrowLeft size={22} />
      </Button>
      <h1 style={heading}>Verify number</h1>
      <p style={bodyMuted}>Use any 6 digits for this prototype flow.</p>
      <input
        value={otp}
        onChange={(event) => setOtp(event.target.value)}
        type="tel"
        maxLength={6}
        placeholder="------"
        className="mt-10 h-16 w-full text-center text-3xl font-black tracking-[0.75em] outline-none"
        style={{ borderRadius: 'var(--radius-control)', border: '1px solid var(--hatid-border-strong)', color: 'var(--hatid-ink)', transition: 'border-color 140ms ease, box-shadow 140ms ease' }}
        onFocus={fieldFocus(true)}
        onBlur={fieldFocus(false)}
      />
      <Button fullWidth disabled={!valid} onClick={() => go('profile')} style={{ marginTop: 'auto', marginBottom: '2rem' }}>
        Verify &amp; continue
      </Button>
    </section>
  );
}

function Profile({ go }: { go: (screen: Screen) => void }) {
  return (
    <section className="flex h-full flex-col px-6 pt-16" style={{ background: 'var(--surface-raised)' }}>
      <h1 style={heading}>Set up profile</h1>
      <p style={bodyMuted}>These fields are prototype-only until Supabase profile saving is wired.</p>
      <label className="mt-8 block" style={{ ...eyebrow, letterSpacing: '0.08em' }}>Full name</label>
      <div
        className="mt-2 flex items-center px-4 py-1"
        style={{ borderRadius: 'var(--radius-control)', border: '1px solid var(--hatid-border-strong)', transition: 'border-color 140ms ease, box-shadow 140ms ease' }}
        onFocus={fieldFocus(true)}
        onBlur={fieldFocus(false)}
      >
        <User size={18} style={{ color: 'var(--text-faint)' }} />
        <input type="text" placeholder="e.g. Maria Santos" className="w-full py-3 pl-3 text-sm font-bold outline-none" style={{ background: 'transparent', color: 'var(--text-primary)' }} />
      </div>
      <Button fullWidth onClick={() => go('permissions')} style={{ marginTop: 'auto', marginBottom: '2rem' }}>
        Continue
      </Button>
    </section>
  );
}

function Permissions({ go }: { go: (screen: Screen) => void }) {
  return (
    <section className="flex h-full flex-col px-6 pt-16" style={{ background: 'var(--surface-raised)' }}>
      <HatidWordmark tagline="Passenger safety setup" />
      <h1 className="mt-10" style={heading}>Let&apos;s keep every ride safe.</h1>
      <p style={bodyMuted}>Permission copy is demo-safe and does not imply live emergency or dispatch operations.</p>
      <div className="mt-8 space-y-4">
        <InfoRow icon={MapPin} title="Location" detail="Needed for pickup and routing previews." />
        <InfoRow icon={Bell} title="Notifications" detail="Used for ride updates once backend flows are active." />
        <InfoRow icon={Shield} title="Safety" detail="Safety actions must be server-owned before production use." />
      </div>
      <Button fullWidth onClick={() => go('home')} style={{ marginTop: 'auto', marginBottom: '2rem' }}>
        Continue to Hatid
      </Button>
    </section>
  );
}

function HomeScreen({ go }: { go: (screen: Screen) => void }) {
  const services: { label: string; icon: LucideIcon }[] = [
    { label: 'Ride', icon: Car },
    { label: 'Moto', icon: Bike },
    { label: 'Work', icon: Briefcase },
    { label: 'Card', icon: CreditCard },
  ];
  return (
    <section className="flex h-full flex-col" style={{ background: 'var(--surface-canvas)' }}>
      <AppHeader title="Hi, Maria" subtitle="Good afternoon - prototype preview" onNotifications={() => undefined} />
      <div className="flex-1 overflow-y-auto px-5 pb-32 pt-4 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        <div className="p-5" style={{ borderRadius: 'var(--radius-sheet)', background: 'var(--hatid-ink)', color: 'var(--text-inverse)', boxShadow: 'var(--shadow-elevated)' }}>
          <HatidWordmark light compact tagline="BGC - Makati - QC - Pasay" />
          <h1 className="mt-6" style={{ ...heading, fontSize: 'var(--text-display)', color: 'var(--text-inverse)' }}>Saan ang punta?</h1>
          <button
            onClick={() => go('book-search')}
            className="mt-5 flex w-full items-center gap-3 p-4 text-left active:scale-[0.99]"
            style={{ borderRadius: 'var(--radius-control)', background: 'var(--surface-raised)', color: 'var(--text-primary)', minHeight: 'var(--touch-target)' }}
          >
            <Search size={20} style={{ color: 'var(--text-faint)' }} />
            <span className="flex-1 text-sm font-bold" style={{ color: 'var(--text-muted)' }}>Where to?</span>
            <Badge variant="secondary">Now</Badge>
          </button>
        </div>
        <div className="mt-6 grid grid-cols-4 gap-3">
          {services.map(({ label, icon: Icon }) => (
            <button key={label} className="flex flex-col items-center gap-2" style={{ minHeight: 'var(--touch-target)' }}>
              <HatidIconTile active={label === 'Ride'}>
                <Icon size={21} />
              </HatidIconTile>
              <span className="text-xs font-bold" style={{ color: 'var(--text-secondary)' }}>{label}</span>
            </button>
          ))}
        </div>
        <WalletSummary go={go} />
        <h3 className="mb-3 mt-6 text-sm font-black" style={{ color: 'var(--hatid-ink)' }}>Recent places</h3>
        <LocationCard icon={<Briefcase size={18} />} label="Work" address="BGC Corporate Center, Taguig" onSelect={() => go('book-choose')} />
      </div>
    </section>
  );
}

function WalletSummary({ go }: { go: (screen: Screen) => void }) {
  return (
    <button onClick={() => go('wallet')} className="mt-6 flex w-full items-center justify-between p-4 text-left" style={{ borderRadius: 'var(--radius-card)', border: '1px solid var(--hatid-border)', background: 'var(--surface-muted)', minHeight: 'var(--touch-target)' }}>
      <div className="flex items-center gap-3">
        <HatidIconTile>
          <Wallet size={18} />
        </HatidIconTile>
        <div>
          <p style={eyebrow}>Hatid Wallet</p>
          <p className="text-sm font-black" style={{ color: 'var(--hatid-ink)' }}>Preview only</p>
        </div>
      </div>
      <Badge variant="secondary">Ledger-owned later</Badge>
    </button>
  );
}

function BookSearch({ go }: { go: (screen: Screen) => void }) {
  return (
    <section className="flex h-full flex-col" style={{ background: 'var(--surface-raised)' }}>
      <AppHeader title="Search destination" onBack={() => go('home')} />
      <div className="px-5 py-4" style={{ borderBottom: '1px solid var(--hatid-border)' }}>
        <InputPin dotColor="var(--hatid-navy)" value="Current location" readOnly />
        <div className="mt-3">
          <InputPin dotColor="var(--hatid-primary)" placeholder="Where to?" focused />
        </div>
      </div>
      <div className="flex-1 p-5">
        <LocationCard
          icon={<Clock size={18} />}
          label="Ayala Triangle Gardens"
          address="Paseo de Roxas, Makati City"
          note="Suggested place - demo data, not live search"
          onSelect={() => go('book-choose')}
        />
      </div>
    </section>
  );
}

function InputPin({ dotColor, value, placeholder, readOnly, focused }: { dotColor: string; value?: string; placeholder?: string; readOnly?: boolean; focused?: boolean }) {
  return (
    <div className="relative flex items-center">
      <div className="absolute left-[10px] h-2 w-2 rounded-full ring-4 ring-white" style={{ background: dotColor }} />
      <input
        value={value}
        readOnly={readOnly}
        placeholder={placeholder}
        className="w-full py-3 pl-8 pr-3 text-sm font-bold outline-none"
        style={{
          borderRadius: 'var(--radius-control)',
          color: 'var(--text-primary)',
          border: `1px solid ${focused ? 'var(--hatid-primary)' : 'var(--hatid-border)'}`,
          background: focused ? 'var(--surface-raised)' : 'var(--surface-muted)',
          boxShadow: focused ? 'var(--shadow-focus)' : 'none',
        }}
      />
    </div>
  );
}

function BookChoose({ go, ride, setRide }: { go: (screen: Screen) => void; ride: RideType; setRide: (ride: RideType) => void }) {
  return (
    <section className="flex h-full flex-col" style={{ background: 'var(--surface-muted)' }}>
      <MapPreview className="h-60">
        <div className="absolute left-5 right-5 top-10 sm:top-12">
          <Card padding="md">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p style={eyebrow}>Route preview</p>
                <h2 className="mt-1" style={{ ...heading, fontSize: 'var(--text-heading-size)' }}>BGC to Makati</h2>
                <p className="mt-1 text-xs" style={{ color: 'var(--text-muted)' }}>Ayala Triangle Gardens - visual preview only</p>
              </div>
              <Badge variant="info">Estimate</Badge>
            </div>
            <div className="mt-3 flex gap-2">
              <Badge variant="success">Family-safe</Badge>
              <Badge variant="secondary">Server-priced later</Badge>
            </div>
          </Card>
        </div>
      </MapPreview>
      <div className="relative z-20 -mt-6 flex flex-1 flex-col">
        <BottomSheet title="Pick the right Hatid" description="Fares and ETAs shown are estimates for prototype review.">
          <div className="space-y-3">
            <RideCard id="car" rideType="HatidCar" description="Comfortable city ride" eta="3 mins" capacity="4 seats" fareEstimate="Est. pending" icon={Car} selected={ride === 'car'} onSelect={() => setRide('car')} />
            <RideCard id="moto" rideType="HatidMoto" description="Fast solo trip - helmet workflow later" eta="1 min" capacity="1 seat" fareEstimate="Est. pending" icon={Bike} selected={ride === 'moto'} onSelect={() => setRide('moto')} />
          </div>
          <div className="mt-4" style={{ borderRadius: 'var(--radius-control)', border: '1px solid #D5DFF3', background: 'var(--hatid-navy-soft)', padding: '0.75rem' }}>
            <p className="text-xs font-bold leading-5" style={{ color: 'var(--hatid-navy)' }}>Fare, dispatch, driver assignment, and wallet charging must be confirmed by server workflows before real use.</p>
          </div>
          <Button fullWidth onClick={() => go('book-active')} style={{ marginTop: '1rem' }}>
            Continue demo ride
          </Button>
        </BottomSheet>
      </div>
    </section>
  );
}

function BookActive({ go }: { go: (screen: Screen) => void }) {
  return (
    <section className="flex h-full flex-col" style={{ background: 'var(--surface-muted)' }}>
      <div className="absolute left-5 right-5 top-10 z-20 sm:top-12">
        <Card padding="md">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p style={eyebrow}>Active demo trip</p>
              <h3 className="mt-1" style={{ ...heading, fontSize: 'var(--text-heading-size)' }}>Driver is arriving</h3>
              <p className="mt-1 text-xs" style={{ color: 'var(--text-muted)' }}>Simulated status - not live dispatch</p>
            </div>
            <Badge variant="info">2 mins</Badge>
          </div>
          <div className="mt-4 flex items-center gap-2">
            <div className="h-2 flex-1 rounded-full" style={{ background: 'var(--hatid-primary)' }} />
            <div className="h-2 flex-1 rounded-full" style={{ background: 'var(--hatid-primary-50)' }} />
            <div className="h-2 flex-1 rounded-full" style={{ background: 'var(--hatid-primary-50)' }} />
          </div>
        </Card>
      </div>
      <MapPreview className="flex-1" />
      <div className="relative z-30 -mt-6">
        <BottomSheet>
          <div className="mb-4 grid grid-cols-2 gap-3">
            <div style={{ borderRadius: 'var(--radius-control)', border: '1px solid #D5DFF3', background: 'var(--hatid-navy-soft)', padding: '0.75rem' }}>
              <span style={{ ...eyebrow, color: 'var(--hatid-navy)' }}>Ride PIN</span>
              <p className="mt-1 text-2xl font-black tracking-widest" style={{ color: 'var(--hatid-ink)' }}>4821</p>
            </div>
            <div style={{ borderRadius: 'var(--radius-control)', border: '1px solid var(--hatid-border)', background: 'var(--surface-muted)', padding: '0.75rem' }}>
              <span style={eyebrow}>Trip state</span>
              <p className="mt-1 text-sm font-black" style={{ color: 'var(--hatid-ink)' }}>Demo only</p>
              <p className="mt-1 text-[11px]" style={{ color: 'var(--text-muted)' }}>Not client-authoritative - server-owned later</p>
            </div>
          </div>
          <DriverCard
            name="Juan Dela Cruz"
            vehicle="Toyota Vios - white"
            plate="ABC-1234"
            rating={4.9}
            statusLabel="Verification copy demo"
            action={
              <Button variant="secondary" size="icon" aria-label="Call driver (demo)">
                <Phone size={18} />
              </Button>
            }
            style={{ marginBottom: '1rem' }}
          />
          <SafetyCard tone="urgent" title="Safety is visual only here" style={{ marginBottom: '1rem' }}>
            Safety actions are visual only here. Real incident handling needs backend workflow, audit logs, and operator escalation.
          </SafetyCard>
          <div className="flex gap-3">
            <Button variant="outline" fullWidth>Share trip</Button>
            <Button variant="danger" fullWidth>Safety help</Button>
          </div>
          <Button variant="link" fullWidth onClick={() => go('book-completed')} style={{ marginTop: '0.75rem', fontSize: 'var(--text-caption)' }}>
            End demo trip
          </Button>
        </BottomSheet>
      </div>
    </section>
  );
}

function Completed({ go }: { go: (screen: Screen) => void }) {
  return (
    <section className="flex h-full flex-col px-6 pt-16" style={{ background: 'var(--surface-raised)' }}>
      <div className="mx-auto grid h-16 w-16 place-items-center rounded-full" style={{ background: 'var(--hatid-success-bg)', color: 'var(--hatid-success)' }}>
        <Check size={32} strokeWidth={3} />
      </div>
      <div className="text-center">
        <h1 className="mt-6" style={heading}>You&apos;ve arrived.</h1>
        <p style={{ ...bodyMuted, marginLeft: 'auto', marginRight: 'auto' }}>Trip completion is a prototype state. Receipt and fare records must be server-generated.</p>
      </div>
      <Card padding="md" style={{ marginTop: '2rem', background: 'var(--surface-muted)', boxShadow: 'none' }}>
        <div className="flex items-center justify-between">
          <div>
            <p style={eyebrow}>Trip summary</p>
            <h2 className="mt-1" style={{ ...heading, fontSize: 'var(--text-heading-size)' }}>BGC to Makati</h2>
          </div>
          <Badge variant="secondary">Demo receipt</Badge>
        </div>
        <div className="mt-4 space-y-3 text-sm">
          <SummaryRow label="Ride type" value="HatidCar" />
          <SummaryRow label="Payment" value="Not charged" />
          <SummaryRow label="Fare" value="Server-owned later" last />
        </div>
      </Card>
      <div className="mt-8 text-center">
        <p style={{ ...eyebrow, letterSpacing: 'var(--tracking-eyebrow)' }}>Rate demo experience</p>
        <div className="mt-3 flex justify-center gap-1">
          {[1, 2, 3, 4, 5].map((star) => (
            <Star key={star} size={28} fill="var(--hatid-yellow)" color="var(--hatid-yellow)" />
          ))}
        </div>
      </div>
      <Button fullWidth onClick={() => go('home')} style={{ marginTop: 'auto', marginBottom: '2rem' }}>
        Back to home
      </Button>
    </section>
  );
}

function SummaryRow({ label, value, last }: { label: string; value: string; last?: boolean }) {
  return (
    <div className="flex justify-between pb-2" style={last ? undefined : { borderBottom: '1px solid var(--hatid-border)' }}>
      <span style={{ color: 'var(--text-muted)' }}>{label}</span>
      <span className="font-black" style={{ color: 'var(--hatid-ink)' }}>{value}</span>
    </div>
  );
}

function Trips({ go }: { go: (screen: Screen) => void }) {
  return (
    <section className="flex h-full flex-col" style={{ background: 'var(--surface-canvas)' }}>
      <AppHeader title="Trips" subtitle="Prototype history - not real trips" />
      <div className="space-y-3 p-5">
        <TripCard title="BGC to Makati" detail="Prototype trip - Today" />
        <TripCard title="Pasay to NAIA" detail="Prototype trip - Yesterday" />
      </div>
    </section>
  );
}

function TripCard({ title, detail }: { title: string; detail: string }) {
  return (
    <Card padding="md">
      <h3 className="text-sm font-black" style={{ color: 'var(--hatid-ink)' }}>{title}</h3>
      <p className="mt-1 text-xs" style={{ color: 'var(--text-muted)' }}>{detail}</p>
    </Card>
  );
}

function WalletScreen() {
  return (
    <section className="flex h-full flex-col" style={{ background: 'var(--surface-canvas)' }}>
      <AppHeader title="Wallet" subtitle="Preview only - no live balance" />
      <div className="flex-1 space-y-4 overflow-y-auto p-5 pb-32 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        <div className="p-5" style={{ borderRadius: 'var(--radius-sheet)', background: 'var(--hatid-ink)', color: 'var(--text-inverse)', boxShadow: 'var(--shadow-elevated)' }}>
          <div className="flex items-start justify-between gap-4">
            <div>
              <p style={{ ...eyebrow, color: 'rgba(255,255,255,0.7)' }}>Hatid Wallet</p>
              <h2 className="mt-2" style={{ ...heading, fontSize: 'var(--text-display)', color: 'var(--text-inverse)' }}>Ledger-safe preview</h2>
            </div>
            <Badge variant="default">Demo</Badge>
          </div>
          <p className="mt-4 text-sm leading-6" style={{ color: 'rgba(255,255,255,0.82)' }}>Balances, payments, refunds, and fares must be generated by audited backend workflows before real use.</p>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <MiniStat label="Balance" value="Not live" />
          <MiniStat label="Charges" value="None" />
        </div>
        <InfoRow icon={CreditCard} title="Payment methods" detail="GCash, Maya, card, and cash labels stay display-only until PSP and reconciliation rules exist." />
        <InfoRow icon={Wallet} title="No client balance edits" detail="Real wallet balances must come from an auditable ledger, never local app state." />
        <div style={{ borderRadius: 'var(--radius-card)', border: '1px solid var(--hatid-warning-bg)', background: 'var(--hatid-warning-bg)', padding: '1rem' }}>
          <p className="text-xs font-bold leading-5" style={{ color: 'var(--hatid-warning)' }}>This wallet screen is safe for prototype review. It does not move, hold, charge, refund, or reconcile money.</p>
        </div>
      </div>
    </section>
  );
}

function MiniStat({ label, value }: { label: string; value: string }) {
  return (
    <Card padding="md" style={{ background: 'var(--surface-muted)', boxShadow: 'none' }}>
      <p style={eyebrow}>{label}</p>
      <p className="mt-1 text-sm font-black" style={{ color: 'var(--hatid-ink)' }}>{value}</p>
    </Card>
  );
}

function SafetyScreen() {
  return (
    <section className="flex h-full flex-col" style={{ background: 'var(--surface-canvas)' }}>
      <AppHeader title="Safety" subtitle="Visual actions only - no live response" />
      <div className="flex-1 space-y-4 overflow-y-auto p-5 pb-32 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        <SafetyCard tone="urgent" title="Clear actions, no false promises">
          Live safety response needs escalation rules, audit logs, trained operators, and local process coverage. Nothing here contacts responders.
        </SafetyCard>
        <InfoRow icon={Shield} title="Share trip" detail="Designed for family visibility once backend trip status, permissions, and delivery channels are active." />
        <InfoRow icon={Phone} title="Safety help" detail="No emergency-response promise until escalation, audit logs, and support staffing exist." />
        <InfoRow icon={HelpCircle} title="Report an issue" detail="Incident reporting should capture evidence, timestamps, participants, and operator resolution states." />
        <Button variant="danger" fullWidth>Open demo safety actions</Button>
      </div>
    </section>
  );
}

function Account() {
  return (
    <section className="flex h-full flex-col" style={{ background: 'var(--surface-canvas)' }}>
      <AppHeader title="Account" subtitle="Passenger preview" />
      <div className="flex-1 space-y-4 overflow-y-auto p-5 pb-32 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        <div className="p-5" style={{ borderRadius: 'var(--radius-sheet)', background: 'var(--hatid-ink)', color: 'var(--text-inverse)' }}>
          <HatidWordmark light compact tagline="Passenger preview" />
          <div className="mt-6 flex items-center gap-4">
            <div className="grid h-14 w-14 place-items-center rounded-2xl font-black" style={{ background: 'rgba(255,255,255,0.1)', boxShadow: 'inset 0 0 0 1px rgba(255,255,255,0.15)' }}>MS</div>
            <div>
              <h2 className="text-lg font-black">Maria Santos</h2>
              <p className="text-sm" style={{ color: 'rgba(255,255,255,0.72)' }}>+63 917 000 0000</p>
            </div>
          </div>
        </div>
        <InfoRow icon={User} title="Profile data" detail="Profile display should later read from Supabase profile records with RLS protection." />
        <InfoRow icon={Settings} title="Preferences" detail="Language, notifications, privacy, and accessibility settings for everyday riders." />
        <InfoRow icon={HelpCircle} title="Support" detail="Help center, incident reporting, and customer support workflow placeholders." />
      </div>
    </section>
  );
}

function InfoRow({ icon: Icon, title, detail }: { icon: LucideIcon; title: string; detail: string }) {
  return (
    <Card padding="md" style={{ display: 'flex', alignItems: 'flex-start', gap: '1rem' }}>
      <HatidIconTile>
        <Icon size={20} />
      </HatidIconTile>
      <div>
        <h3 className="text-sm font-black" style={{ color: 'var(--hatid-ink)' }}>{title}</h3>
        <p className="mt-1 text-xs leading-5" style={{ color: 'var(--text-muted)' }}>{detail}</p>
      </div>
    </Card>
  );
}

export default function App() {
  const [screen, setScreen] = useState<Screen>('splash');
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [ride, setRide] = useState<RideType>('car');

  const showNav = ['home', 'trips', 'wallet', 'safety', 'account'].includes(screen);
  const go = (next: Screen) => setScreen(next);

  return (
    <PhoneFrame showNav={showNav} current={screen} go={go}>
      {screen === 'splash' && <Splash go={go} />}
      {screen === 'login' && <Login go={go} phone={phone} setPhone={setPhone} />}
      {screen === 'otp' && <Otp go={go} otp={otp} setOtp={setOtp} />}
      {screen === 'profile' && <Profile go={go} />}
      {screen === 'permissions' && <Permissions go={go} />}
      {screen === 'home' && <HomeScreen go={go} />}
      {screen === 'book-search' && <BookSearch go={go} />}
      {screen === 'book-choose' && <BookChoose go={go} ride={ride} setRide={setRide} />}
      {screen === 'book-active' && <BookActive go={go} />}
      {screen === 'book-completed' && <Completed go={go} />}
      {screen === 'trips' && <Trips go={go} />}
      {screen === 'wallet' && <WalletScreen />}
      {screen === 'safety' && <SafetyScreen />}
      {screen === 'account' && <Account />}
    </PhoneFrame>
  );
}
