import {providerComponents} from "@/src/hooks/providerMap";

interface AllProvidersProps {
    onSelect: (provider: string) => void;
}

export const AllProviders = ({ onSelect }: AllProvidersProps) => {
    const providers = Object.keys(providerComponents);

    return (
        <div className="all-providers">
            <ul>
                {providers.map((title, index) => (
                    <li key={index}>
                        <button onClick={() => onSelect(title)}>{title}</button>
                    </li>
                ))}
            </ul>
        </div>
    );
};
