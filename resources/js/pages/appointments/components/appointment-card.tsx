import { Mail, Phone, Building2, MapPin, MoreVertical } from 'lucide-react';

export interface ContactCardProps {
    initials: string;
    name: string;
    title: string;
    email: string;
    phone: string;
    company: string;
    location: string;
    tags: { label: string; variant: 'green' | 'yellow' }[];
    dealValue: string;
    ownerName: string;
    ownerAvatarUrl: string;
    onMoreClick?: () => void;
}

const tagStyles: Record<ContactCardProps['tags'][number]['variant'], string> = {
    green: 'bg-emerald-100 text-emerald-700',
    yellow: 'bg-amber-100 text-amber-700',
};

const ContactCard: React.FC<ContactCardProps> = ({
    initials,
    name,
    title,
    email,
    phone,
    company,
    location,
    tags,
    dealValue,
    ownerName,
    ownerAvatarUrl,
    onMoreClick,
}) => {
    return (
        <div className="w-full bg-slate-100 p-6">
            <div className="mx-auto max-w-5xl rounded-2xl bg-white px-6 py-5 shadow-sm">
                <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                    {/* Left: avatar + identity */}
                    <div className="flex items-center gap-3 md:min-w-[260px]">
                        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-slate-100 text-sm font-semibold text-slate-700">
                            {initials}
                        </div>
                        <div>
                            <div className="text-[15px] font-semibold text-slate-900">
                                {name}
                            </div>
                            <div className="text-sm text-slate-400">
                                {title}
                            </div>
                        </div>
                    </div>

                    {/* Middle: contact details */}
                    <div className="flex flex-col gap-2 md:flex-1 md:px-6">
                        <div className="flex flex-col gap-2 sm:flex-row sm:gap-10">
                            <div className="flex items-center gap-2 text-sm text-slate-500">
                                <Mail className="h-4 w-4 text-slate-400" />
                                <span>{email}</span>
                            </div>
                            <div className="flex items-center gap-2 text-sm text-slate-500">
                                <Phone className="h-4 w-4 text-slate-400" />
                                <span>{phone}</span>
                            </div>
                        </div>
                        <div className="flex flex-col gap-2 sm:flex-row sm:gap-10">
                            <div className="flex items-center gap-2 text-sm text-slate-500">
                                <Building2 className="h-4 w-4 text-slate-400" />
                                <span>{company}</span>
                            </div>
                            <div className="flex items-center gap-2 text-sm text-slate-500">
                                <MapPin className="h-4 w-4 text-slate-400" />
                                <span>{location}</span>
                            </div>
                        </div>
                    </div>

                    {/* Tags */}
                    <div className="flex items-center gap-2">
                        {tags.map((tag) => (
                            <span
                                key={tag.label}
                                className={`rounded-full px-3 py-1 text-xs font-medium ${tagStyles[tag.variant]}`}
                            >
                                {tag.label}
                            </span>
                        ))}
                    </div>

                    {/* Right: deal value + owner */}
                    <div className="flex items-center gap-6 md:pl-4">
                        <div className="text-right">
                            <div className="text-xs text-slate-400">
                                Deal Value
                            </div>
                            <div className="text-lg font-semibold text-emerald-500">
                                {dealValue}
                            </div>
                        </div>

                        <div className="flex flex-col items-center gap-1">
                            <img
                                src={ownerAvatarUrl}
                                alt={ownerName}
                                className="h-8 w-8 rounded-full object-cover"
                            />
                            <span className="text-xs text-slate-600">
                                {ownerName}
                            </span>
                        </div>

                        <button
                            onClick={onMoreClick}
                            className="text-slate-400 transition-colors hover:text-slate-600"
                            aria-label="More options"
                        >
                            <MoreVertical className="h-5 w-5" />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ContactCard;

// Example usage:
// <ContactCard
//   initials="JA"
//   name="John Anderson"
//   title="VP of Operations at TechCorp Industries"
//   email="john@techcorp.com"
//   phone="+1 (555) 123-4567"
//   company="TechCorp Industries"
//   location="San Francisco, CA"
//   tags={[
//     { label: "qualified", variant: "green" },
//     { label: "website", variant: "yellow" },
//   ]}
//   dealValue="$85K"
//   ownerName="Sarah Chen"
//   ownerAvatarUrl="/avatars/sarah-chen.jpg"
// />
