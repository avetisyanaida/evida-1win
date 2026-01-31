import {useState, useEffect} from "react";
import {useTranslation} from "react-i18next";
import {supabase} from "@/src/hooks/supabaseClient";
import {useCasino} from "@/src/components/CasinoContext/CasinoContext";

interface DepositProps {
    onClose: () => void;
    onBalanceUpdate: (newBalance: number) => void;
    mode: "card" | "idram" | "telcell"
}

interface SavedCard {
    id: string;
    brand: string;
    last4: string;
    provider: string;
}

export default function Deposit({onClose, mode}: DepositProps) {
    const [amount, setAmount] = useState("");
    const [text, setText] = useState("");
    const [provider] = useState("idram");
    const {t} = useTranslation();
    const {showMoreInfo, setShowMoreInfo} = useCasino();

    const [savedCards, setSavedCards] = useState<SavedCard[]>([]);
    const [selectedCardId, setSelectedCardId] = useState<string | null>(null);
    const [cardsOpen, setCardsOpen] = useState(false);




    useEffect(() => {
        if (mode !== "card") return;

        const loadCards = async () => {
            const { data: userData } = await supabase.auth.getUser();
            const user = userData?.user;
            if (!user) return;

            const { data } = await supabase
                .from("cards")
                .select("id, brand, last4, provider")
                .eq("user_id", user.id)
                .order("created_at", { ascending: false });

            if (data && data.length > 0) {
                setSavedCards(data);
                setSelectedCardId(data[0].id);
            }
        };

        loadCards().then(() => {});
    }, [mode]);


    // eslint-disable-next-line react-hooks/set-state-in-effect
    useEffect(() => setText(""), [amount, provider]);

    const handleDeposit = async () => {
        const num = Number(amount);

        if (!num || num < 200) {
            setText("❌ Գումարը պետք է լինի առնվազն 200 AMD");
            return;
        }

        try {
            const { data: userData } = await supabase.auth.getUser();
            const user = userData?.user;

            if (!user) {
                setText("Մուտք գործիր, հետո նոր փորձիր");
                return;
            }

            if (mode === "card") {

                if (selectedCardId) {
                    const res = await fetch("/api/payments/deposit-saved-card", {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({
                            user_id: user.id,
                            amount: num,
                            card_id: selectedCardId,
                        }),
                    });

                    if (res.ok) {
                        setText("✅ Հաշիվը հաջողությամբ համալրվել է");
                    } else {
                        setText("❌ Սխալ պահպանված քարտով վճարման ժամանակ");
                    }
                    return;
                }

                const res = await fetch("/api/payments/deposit", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        amount: num,
                        method: "card",
                    }),
                });

                const data = await res.json();
                if (data.redirectUrl) {
                    window.location.href = data.redirectUrl;
                }
                return;
            }

            const res = await fetch("/api/payments/deposit", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    amount: num,
                    method: mode,
                }),
            });

            const data = await res.json();
            if (data.redirectUrl) {
                window.location.href = data.redirectUrl;
            }

        } catch (err: any) {
            console.error("Deposit error:", err);
            setText("❌ Սխալ կատարման ընթացքում");
        }
    };


    return (
        <div className="deposit-wallet">
            {mode === "card" && (
                <>
                    <h3>{t("arcaDescription")}</h3>
                    <h4 style={{color: 'red'}}>{t("lawNote")}</h4>
                    <div className={'more-info-card'}>
                        <button onClick={() => setShowMoreInfo(!showMoreInfo)}
                                className={'btn-more-info'}>{showMoreInfo ? "Փակել" : "Ավելին"}</button>

                        {showMoreInfo && (
                            <div className={'more-info'}>
                                <h5 style={{color: 'grey'}}>ARCA/VISA/MASTER քարտով խաղային հաշիվը համալրելու համար՝ <br/>
                                    1. Նշեք գումարը <br/>
                                    2. սեղմեք Հաստատել
                                </h5>
                                <h5 style={{color: 'grey'}}>*Հետագայում քարտերի ցանկից կարող եք ընտրել այն քարտը, որով նախկինում կատարել եք
                                    համալրում։</h5>
                                <h5 style={{color: 'grey'}}>Դուք կուղղորդվեք վճարամիջոցի էջ՝ <br/>
                                    1․ լրացրեք քարտի տվյալները՝ Համարը, վավեր․ ժամկետը, քարտապանի անունը, CVV2/CVC2 (քարտի
                                    հակառակ կողմի
                                    3 թվերը) <br/>
                                    2. կատարեք քայլերը ըստ հրահանգների <br/>
                                    3․ հաստատեք համալրումը
                                </h5>
                            </div>
                        )}
                    </div>

                    {savedCards.length > 0 && (
                        <div className="card-select">
                            <div
                                className="card-select-header"
                                onClick={() => setCardsOpen(!cardsOpen)}
                            >
                                <div className="card-summary">
                                    {selectedCardId
                                        ? (() => {
                                            const card = savedCards.find(c => c.id === selectedCardId);
                                            return `${card?.brand} •••• ${card?.last4}`;
                                        })()
                                        : "➕ Նոր քարտ"}
                                </div>

                                <div className="arrow">
                                    {cardsOpen ? "▲" : "▼"}
                                </div>
                            </div>

                            {cardsOpen && (
                                <div className="card-select-body">
                                    {savedCards.map(card => (
                                        <div
                                            key={card.id}
                                            className={`card-option ${
                                                selectedCardId === card.id ? "active" : ""
                                            }`}
                                            onClick={() => {
                                                setSelectedCardId(card.id);
                                                setCardsOpen(false); // ընտրելուց հետո փակվում է
                                            }}
                                        >
                                            {card.brand} •••• {card.last4}
                                        </div>
                                    ))}

                                    <div
                                        className={`card-option new ${
                                            selectedCardId === null ? "active" : ""
                                        }`}
                                        onClick={() => {
                                            setSelectedCardId(null);
                                            setCardsOpen(false);
                                        }}
                                    >
                                        ➕ Նոր քարտ
                                    </div>
                                </div>
                            )}
                        </div>
                    )}
                </>

            )}

            {mode === "idram" && (
                <>
                    <h2 style={{color: 'white', textAlign: "left"}}>IDram/IDBank</h2>
                    <div className={'more-info-card'}>
                        <button onClick={() => {
                            setShowMoreInfo(!showMoreInfo);
                        }}
                                className={'btn-more-info'}>{showMoreInfo ? "Փակել" : "Ավելին"}</button>
                        {showMoreInfo && (
                            <div className={'more-info'}>
                                <h5 style={{color: 'red'}}>
                                    Խաղային հաշվի համալրումը կկատարվի ԱյԴի Բանկում ունեցած Ձեր բանկային հաշվի միջոցով։
                                </h5>
                                <h5 style={{color: 'grey'}}>Idram&IDBank (մոբայլ բանկինգ) հավելվածի միջոցով համալրում կատարելու համար անհրաժեշտ է
                                    ծանոթանալ նոր պայմաններին և տալ Ձեր համաձայնությունը` սեղմելով «ՀԱՄԱՁԱՅՆ ԵՄ»:</h5>
                                <h5 style={{color: 'grey'}}>Idram&IDBank մոբայլ բանկինգ հավելվածի միջոցով խաղային հաշիվը համալրելու համար՝ <br/>
                                    1․ մուտքագրեք գումարի չափը <br/>
                                    2. սեղմեք ՀԱՍՏԱՏԵԼ <br/>
                                </h5>
                                <h5 style={{color: 'grey'}}>Դուք կտեղափոխվեք Idram&IDBank հավելված: Այստեղ՝
                                    <br/> 1. մուտք գործեք Ձեր դրամապանակ <br/>
                                    2. բացված էջում սեղմեք ՎՃԱՐԵԼ <br/>
                                    3. մուտքագրեք Ձեր PIN կոդը և սեղմեք ՀԱՍՏԱՏԵԼ
                                </h5>
                            </div>
                        )}
                    </div>
                </>
            )}
            <label>
                <input
                    className={'no-spinner'}
                    type="number"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    placeholder="100 - 100.000 (AMD)"
                />
            </label>

            <div className="btn">
                <button onClick={handleDeposit} style={{backgroundColor: '#d2c81b', color: 'black'}}>{t("ok")}</button>
                <button onClick={onClose} style={{backgroundColor: '#211a4f'}}>{t("cancel")}</button>
            </div>

            {text && <p style={{marginTop: 20, color: text.includes("❌") ? "red" : "green"}}>{text}</p>}
        </div>
    );
};
