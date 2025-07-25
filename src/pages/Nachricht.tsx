import { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight, LockKeyhole, Scale, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate, useParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

interface LawFirm {
  id: string;
  name: string;
  description: string | null;
  logo_url: string | null;
  phone: string | null;
  slug: string;
  created_at: string;
  updated_at: string;
}

interface LegalArea {
  id: string;
  name: string;
  slug: string;
}

const Nachricht = () => {
  const [step, setStep] = useState(1);
  const [concern, setConcern] = useState("personal");
  const [message, setMessage] = useState("");
  const [gender, setGender] = useState("");
  const [firstname, setFirstname] = useState("");
  const [lastname, setLastname] = useState("");
  const [email, setEmail] = useState("");
  const [hasInsurance, setHasInsurance] = useState(false);
  const [lawFirm, setLawFirm] = useState<LawFirm | null>(null);
  const [legalAreas, setLegalAreas] = useState<LegalArea[]>([]);
  const [loading, setLoading] = useState(true);
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    if (slug) {
      fetchLawFirmData();
    } else {
      // Use static data for /vorlage route
      setLawFirm({
        id: 'static',
        name: 'Steinbock & Partner Rechtsanwaltskanzlei Fachanwälte - Steuerberater',
        description: null,
        logo_url: 'https://www.anwalt.de/cdn-cgi/image/format=auto,fit=scale-down,width=80,height=80/upload/company/9b/9bde51a88bde31ae1c0ce33c48ff0b98/Logo-Quadrat_RGB-300ppi_Anwaelte_62c6ff9ca63946.09830762.jpg',
        phone: null,
        slug: 'static',
        created_at: '',
        updated_at: ''
      });
      setLoading(false);
    }
  }, [slug]);

  // Set dynamic page title and meta description
  useEffect(() => {
    if (lawFirm) {
      document.title = `ᐅ Nachricht an ${lawFirm.name} ᐅ exklusiv bei anwalt.de!`;
      
      // Set meta description
      const metaDescription = document.querySelector('meta[name="description"]');
      if (metaDescription) {
        metaDescription.setAttribute('content', `Senden Sie eine Nachricht an ${lawFirm.name}. Kostenloses Kontaktformular für Ihre Rechtsberatung - exklusiv bei anwalt.de!`);
      } else {
        const meta = document.createElement('meta');
        meta.name = 'description';
        meta.content = `Senden Sie eine Nachricht an ${lawFirm.name}. Kostenloses Kontaktformular für Ihre Rechtsberatung - exklusiv bei anwalt.de!`;
        document.head.appendChild(meta);
      }
    }
  }, [lawFirm]);

  const fetchLawFirmData = async () => {
    try {
      const { data: firmData, error: firmError } = await supabase
        .from('law_firms')
        .select('*')
        .eq('slug', slug)
        .single();

      if (firmError) {
        if (firmError.code === 'PGRST116') {
          navigate('/');
          return;
        }
        throw firmError;
      }

      setLawFirm(firmData);

      // Fetch legal areas for this law firm
      const { data: areasData, error: areasError } = await supabase
        .from('law_firm_legal_areas')
        .select(`
          legal_area:legal_areas(
            id,
            name,
            slug
          )
        `)
        .eq('law_firm_id', firmData.id);

      if (areasError) {
        console.error('Error fetching legal areas:', areasError);
      } else {
        const areas = areasData.map(item => item.legal_area).filter(Boolean);
        setLegalAreas(areas);
      }
    } catch (error: any) {
      console.error('Error fetching law firm data:', error);
      toast({
        title: "Error",
        description: "Failed to load law firm data",
        variant: "destructive"
      });
      navigate('/');
    } finally {
      setLoading(false);
    }
  };

  const displayName = lawFirm?.name || "Law Firm";
  const displayLogo = lawFirm?.logo_url || "https://www.anwalt.de/cdn-cgi/image/format=auto,fit=scale-down,width=80,height=80/upload/company/9b/9bde51a88bde31ae1c0ce33c48ff0b98/Logo-Quadrat_RGB-300ppi_Anwaelte_62c6ff9ca63946.09830762.jpg";

  const handleBack = () => {
    if (step === 1) {
      navigate(-1);
    } else if (step === 2) {
      setStep(1);
    } else if (step === 3) {
      setStep(2);
    }
  };

  const handleNext = () => {
    if (step === 1) {
      setStep(2);
    } else if (step === 2) {
      setStep(3);
    }
  };

  const maxLength = 3000;

  return (
    <div className="min-h-screen flex flex-col bg-white">
      {/* Header */}
      <header className="border-b border-neutral-300 bg-white sticky top-0 z-10 h-[58px]">
        <div className="w-full max-w-7xl mx-auto py-4 px-4 xl:px-2.5 flex items-center justify-between">
          <a href="/" className="flex w-[185px]">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 371.34 70.81" className="h-9 w-auto">
              <path fill="#e95a0c" d="M103.12,48.56h-17.71l-3.52,9.66h-5.14l15.02-39.66h4.86l15.14,39.66h-5.14l-3.52-9.66Zm-1.56-4.25l-7.26-19.83h-.11l-7.21,19.83h14.58Z"></path>
              <path fill="#e95a0c" d="M149.93,18.56V58.22h-4.97l-22.23-31.28h-.11v31.28h-4.86V18.56h4.8l22.4,31.61h.11V18.56h4.86Z"></path>
              <path fill="#e95a0c" d="M208.09,18.56l-12.68,39.66h-4.69l-9.16-32.51h-.06l-9.33,32.51h-4.69l-12.68-39.66h5.19l9.77,31.67h.11l8.94-31.67h5.31l8.94,31.78h.06l9.77-31.78h5.19Z"></path>
              <path fill="#e95a0c" d="M233.18,48.56h-17.71l-3.52,9.66h-5.14l15.02-39.66h4.86l15.14,39.66h-5.14l-3.52-9.66Zm-1.56-4.25l-7.26-19.83h-.11l-7.21,19.83h14.58Z"></path>
              <path fill="#e95a0c" d="M247.81,18.56h4.86V53.75h19.66v4.47h-24.52V18.56Z"></path>
              <path fill="#e95a0c" d="M277.86,23.03h-11.9v-4.47h28.71v4.47h-11.95V58.22h-4.86V23.03Z"></path>
              <path fill="#385171" d="M293.41,54.37c0-2.2,1.69-3.92,3.92-3.92,2.09,0,3.85,1.72,3.85,3.92s-1.76,3.85-3.85,3.85c-2.23,0-3.92-1.72-3.92-3.85Z"></path>
              <path fill="#385171" d="M308.75,18.56h11.9c12.57,0,20.56,8.15,20.56,19.88s-7.76,19.77-20.39,19.77h-12.07V18.56Zm11.73,35.24c9.55,0,15.75-6.42,15.75-15.36s-6.26-15.47-15.53-15.47h-7.09v30.83h6.87Z"></path>
              <path fill="#385171" d="M345.87,18.56h24.3v4.47h-19.38v13.24h15.92v4.47h-15.92v13.01h20.55v4.47h-25.47V18.56Z"></path>
              <circle fill="#385171" cx="35.41" cy="35.41" r="35.41"></circle>
              <g>
                <path fill="#fff" d="M42.65,39.13l6.62-12.98c.19-.38,.73-.38,.92,0l6.62,12.98s0,.02,0,.03h.55c-.67,3.61-3.83,6.35-7.63,6.35s-6.96-2.74-7.63-6.35h.55s0-.02,0-.03Zm11.53,.03l-3.99-8.12c-.19-.38-.74-.38-.92,0l-3.99,8.12h8.91Z"></path>
                <path fill="#fff" d="M14.44,46.03s0-.02,0-.03l6.62-12.98c.19-.38,.73-.38,.92,0l6.62,12.98s0,.02,0,.03h.55c-.67,3.61-3.83,6.35-7.63,6.35s-6.96-2.74-7.63-6.35h.55Zm11.54,0l-3.99-8.12c-.19-.38-.74-.38-.92,0l-3.99,8.12h8.91Z"></path>
                <rect fill="#fff" x="18.13" y="24.08" width="33.15" height="3.56" rx=".92" ry=".92" transform="translate(-5.07 8.79) rotate(-13.46)"></rect>
              </g>
            </svg>
          </a>
          <div className="flex items-center">
            <LockKeyhole style={{ color: '#64748b' }} size={16} strokeWidth={2.5} />
            <span className="ml-2 sm:inline hidden text-sm" style={{ color: '#64748b' }}>
              Gesicherte Verbindung
            </span>
          </div>
        </div>
      </header>

      {/* Breadcrumb Steps */}
      <div className="sticky top-[58px] z-10">
        <nav aria-label="Breadcrumbs" className="bg-white border-b border-neutral-200 py-3">
          <ol className="flex items-center justify-center gap-4 max-w-4xl mx-auto px-4">
            <li className="flex items-center">
              <span className={
                step === 1 
                  ? "text-black text-sm font-medium" 
                  : step > 1 
                    ? "text-sm font-medium" 
                    : "text-neutral-500 text-sm"
              } style={step > 1 ? { color: '#4ec085' } : {}}>
                Rechtsanliegen schildern
              </span>
              <ChevronRight className="ml-4 text-neutral-500" size={16} />
            </li>
            <li className="flex items-center">
              <span className={
                step === 2 
                  ? "text-black text-sm font-medium" 
                  : step > 2 
                    ? "text-sm font-medium" 
                    : "text-neutral-500 text-sm"
              } style={step > 2 ? { color: '#4ec085' } : {}}>
                Kontaktinfo
              </span>
              <ChevronRight className="ml-4 text-neutral-500" size={16} />
            </li>
            <li>
              <span className={step === 3 ? "text-black text-sm font-medium" : "text-neutral-500 text-sm"}>
                Bestätigen
              </span>
            </li>
          </ol>
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-y-auto max-w-[1920px] w-full m-auto px-4 md:px-0 flex">
        <div className="grid grid-cols-1 xl:grid-cols-[1fr_auto] 2xl:grid-cols-[auto_1fr_auto] justify-center xl:!justify-between w-full min-h-full">
          {/* Left Spacer */}
          <div className="xl:w-[440px] hidden 2xl:block"></div>

          {/* Center Content */}
          <div className="w-[480px] max-w-full mx-auto">
            <div className="my-12">
              {step === 1 ? (
                <>
                  <h1 className="text-2xl font-semibold mb-6 leading-8">
                    Nachricht an {displayName}
                  </h1>

                  <div className="mb-9">
                    {/* Radio Button Group */}
                    <fieldset className="mb-6">
                      <legend className="text-neutral-700 text-base mb-5">
                        Ist Ihr Anliegen privat oder geschäftlich?
                      </legend>
                      <div className="flex gap-6">
                        <div className="flex items-center">
                          <input
                            id="personal"
                            name="concern"
                            value="personal"
                            type="radio"
                            checked={concern === "personal"}
                            onChange={(e) => setConcern(e.target.value)}
                            className="w-4 h-4 text-radio-blue bg-gray-100 border-gray-300 focus:ring-radio-blue focus:ring-2"
                          />
                          <label htmlFor="personal" className="ml-2 text-neutral-900">
                            Privat
                          </label>
                        </div>
                        <div className="flex items-center">
                          <input
                            id="commercial"
                            name="concern"
                            value="commercial"
                            type="radio"
                            checked={concern === "commercial"}
                            onChange={(e) => setConcern(e.target.value)}
                            className="w-4 h-4 text-radio-blue bg-gray-100 border-gray-300 focus:ring-radio-blue focus:ring-2"
                          />
                          <label htmlFor="commercial" className="ml-2 text-neutral-900">
                            Geschäftlich
                          </label>
                        </div>
                      </div>
                    </fieldset>

                    {/* Message Textarea */}
                    <div className="mb-2">
                      <textarea
                        id="message"
                        rows={4}
                        placeholder="Bitte beschreiben Sie Ihr Anliegen möglichst genau"
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        maxLength={maxLength}
                        className="w-full px-4 py-3 border-0 rounded-md focus:outline-none resize-vertical bg-card-input-bg placeholder-placeholder-text min-h-[120px]"
                        style={{
                          '--placeholder-color': 'hsl(var(--placeholder-text))',
                          width: '120%',
                          maxWidth: '120%'
                        } as React.CSSProperties}
                      />
                    </div>
                    <div className="text-sm text-gray-500 mb-3 text-right" style={{ width: '120%', maxWidth: '120%' }}>
                      <span className={message.length === 0 ? "text-red-500" : ""}>
                        {message.length}
                      </span>
                      /{maxLength}
                    </div>
                  </div>
                </>
              ) : step === 2 ? (
                <>
                  <h1 className="text-2xl font-semibold mb-8 leading-8">
                    Kontaktinfo für die Antwort
                  </h1>

                  <div>
                    {/* Gender Selection */}
                    <fieldset className="flex gap-4 mb-8">
                      <legend className="sr-only">Wie lautet Ihre Anrede?</legend>
                      <div className="flex items-center">
                        <input
                          id="male"
                          name="gender"
                          value="1"
                          type="radio"
                          checked={gender === "1"}
                          onChange={(e) => setGender(e.target.value)}
                          className="w-4 h-4 text-radio-blue bg-gray-100 border-gray-300 focus:ring-radio-blue focus:ring-2"
                        />
                        <label htmlFor="male" className="ml-2 text-neutral-900">Herr</label>
                      </div>
                      <div className="flex items-center">
                        <input
                          id="female"
                          name="gender"
                          value="2"
                          type="radio"
                          checked={gender === "2"}
                          onChange={(e) => setGender(e.target.value)}
                          className="w-4 h-4 text-radio-blue bg-gray-100 border-gray-300 focus:ring-radio-blue focus:ring-2"
                        />
                        <label htmlFor="female" className="ml-2 text-neutral-900">Frau</label>
                      </div>
                      <div className="flex items-center">
                        <input
                          id="undefined"
                          name="gender"
                          value="3"
                          type="radio"
                          checked={gender === "3"}
                          onChange={(e) => setGender(e.target.value)}
                          className="w-4 h-4 text-radio-blue bg-gray-100 border-gray-300 focus:ring-radio-blue focus:ring-2"
                        />
                        <label htmlFor="undefined" className="ml-2 text-neutral-900">Keine Angabe</label>
                      </div>
                    </fieldset>

                    {/* Name Fields */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-3">
                      <div className="relative mb-3">
                        <input
                          id="firstname"
                          type="text"
                          value={firstname}
                          onChange={(e) => setFirstname(e.target.value)}
                          className="w-full px-4 py-3 border-0 rounded-md focus:outline-none bg-card-input-bg placeholder-placeholder-text peer"
                          placeholder=" "
                        />
                        <label
                          htmlFor="firstname"
                          className="absolute text-sm text-gray-500 duration-300 transform -translate-y-4 scale-75 top-2 z-10 origin-[0] bg-card-input-bg px-2 peer-focus:px-2 peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-4 left-1"
                        >
                          Vorname
                        </label>
                      </div>
                      <div className="relative mb-3">
                        <input
                          id="lastname"
                          type="text"
                          value={lastname}
                          onChange={(e) => setLastname(e.target.value)}
                          className="w-full px-4 py-3 border-0 rounded-md focus:outline-none bg-card-input-bg placeholder-placeholder-text peer"
                          placeholder=" "
                        />
                        <label
                          htmlFor="lastname"
                          className="absolute text-sm text-gray-500 duration-300 transform -translate-y-4 scale-75 top-2 z-10 origin-[0] bg-card-input-bg px-2 peer-focus:px-2 peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-4 left-1"
                        >
                          Nachname
                        </label>
                      </div>
                    </div>

                    {/* Email Field */}
                    <div className="relative mb-3">
                      <input
                        id="email"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full px-4 py-3 border-0 rounded-md focus:outline-none bg-card-input-bg placeholder-placeholder-text peer"
                        placeholder=" "
                      />
                      <label
                        htmlFor="email"
                        className="absolute text-sm text-gray-500 duration-300 transform -translate-y-4 scale-75 top-2 z-10 origin-[0] bg-card-input-bg px-2 peer-focus:px-2 peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-4 left-1"
                      >
                        E-Mail
                      </label>
                    </div>

                    {/* Insurance Checkbox */}
                    <div className="mb-5 mt-6">
                      <div className="mb-4">
                        <div className="flex items-center">
                          <input
                            id="insurance"
                            name="insurance"
                            type="checkbox"
                            checked={hasInsurance}
                            onChange={(e) => setHasInsurance(e.target.checked)}
                            className="w-4 h-4 text-radio-blue bg-gray-100 border-gray-300 rounded focus:ring-radio-blue focus:ring-2"
                          />
                          <label htmlFor="insurance" className="ml-2 text-neutral-900">
                            Ich habe eine Rechtsschutzversicherung (optional)
                          </label>
                        </div>
                      </div>
                    </div>

                    {/* Terms and Privacy */}
                    <p className="text-neutral-700 text-base mb-9">
                      Mit Klick auf „Absenden" akzeptieren Sie die{" "}
                      <a
                        target="_blank"
                        href="/pdf/Nutzungsbedingungen_Nutzer_anwalt.de.pdf"
                        className="underline"
                      >
                        Nutzungsbedingungen.
                      </a>{" "}
                      Hinweise zum Datenschutz finden Sie in unserer{" "}
                      <a
                        target="_blank"
                        href="/pdf/DSE_anwalt.de.pdf"
                        className="underline"
                      >
                        Datenschutzerklärung.
                      </a>
                    </p>
                  </div>
                </>
              ) : (
                <>
                  <div className="my-12">
                    <Mail className="text-[32px] mb-5 relative left-[1px] text-neutral-900" size={32} />
                    <h1 className="text-2xl font-semibold mb-6 leading-8" data-testid="confirmation-heading">
                      Nachricht erfolgreich versendet
                    </h1>
                    <p className="mb-3 text-neutral-600">
                      Ihre Nachricht wurde erfolgreich versendet.
                    </p>
                    <p className="mb-3 text-neutral-600">
                      {displayName} wird sich in Kürze bei der angegebenen E-Mail-Adresse <span className="font-semibold">{email}</span> melden.
                    </p>
                  </div>
                </>
              )}

              {/* Action Buttons */}
              {step < 3 && (
                <div className="md:flex md:justify-between mt-3" style={{ width: '120%', maxWidth: '120%' }}>
                  <Button
                    variant="ghost"
                    onClick={handleBack}
                    className="md:flex hidden items-center"
                    style={{ color: '#1d4ed8', fontSize: '1.1em' }}
                  >
                    <ChevronLeft className="mr-1.5" size={18} style={{ color: '#1d4ed8' }} />
                    Zurück
                  </Button>
                  <Button
                    onClick={handleNext}
                    className="md:w-auto w-full bg-orange-primary hover:bg-orange-primary/90"
                  >
                    {step === 1 ? "Weiter" : "Absenden"}
                    <ChevronRight className="ml-1.5" size={16} />
                  </Button>
                </div>
              )}
            </div>
          </div>

          {/* Right Sidebar */}
          <div className="xl:w-[480px] hidden xl:block">
            <div className="bg-card-input-bg px-10 py-10 h-full">
              <div className="mb-6 text-sm text-neutral-700">Ihre Kanzlei</div>
              
              <div className="mb-3 flex gap-4 xl:items-center">
                <figure>
                  <img
                    alt={`Bild von ${displayName}`}
                    src={displayLogo}
                    className="rounded-xl"
                    height="80"
                    width="80"
                  />
                </figure>
                <div>
                  <span
                    title={displayName}
                    className="text-black text-lg font-semibold"
                  >
                    {displayName}
                  </span>
                </div>
              </div>

              <div className="mt-12">
                <p className="mb-2 flex items-center gap-2 text-sm font-semibold" style={{ color: 'hsl(var(--dark-slate))', fontSize: '1.045em' }}>
                  <Scale className="shrink-0" style={{ color: 'hsl(var(--dark-slate))' }} size={18} />
                  Rechtsgebiete:
                </p>
                <div className="flex flex-wrap gap-2 text-legal-text" style={{ fontSize: '1em' }}>
                  {[
                    "Arbeitsrecht", "Steuerrecht", "Verkehrsrecht", "Medizinrecht",
                    "Handelsrecht & Gesellschaftsrecht", "Baurecht & Architektenrecht",
                    "Mietrecht & Wohnungseigentumsrecht", "Insolvenzrecht & Sanierungsrecht",
                    "Strafrecht", "Versicherungsrecht", "Zivilrecht",
                    "Schadensersatzrecht & Schmerzensgeldrecht", "Forderungseinzug & Inkassorecht",
                    "Allgemeines Vertragsrecht", "Grundstücksrecht & Immobilienrecht",
                    "Arzthaftungsrecht", "Maklerrecht", "Erbrecht", "Wirtschaftsrecht",
                    "Gewerblicher Rechtsschutz", "Datenschutzrecht", "Ordnungswidrigkeitenrecht",
                    "Zwangsvollstreckungsrecht"
                  ].map((area, index, array) => (
                    <span key={area} className="inline-flex items-center">
                      {area}
                      {index < array.length - 1 && (
                        <span className="mx-1 w-1 h-1 bg-neutral-300 rounded-full"></span>
                      )}
                    </span>
                  ))}
                </div>
              </div>

              <div className="mt-6 flex gap-2">
                <p className="mb-2 flex items-center gap-2 text-sm font-semibold mb-0" style={{ color: 'hsl(var(--dark-slate))', fontSize: '1.045em' }}>
                  <svg className="shrink-0" style={{ color: 'hsl(var(--dark-slate))' }} width="18" height="18" viewBox="0 0 576 512" fill="currentColor">
                    <path d="M64 96c-17.7 0-32 14.3-32 32V384c0 17.7 14.3 32 32 32H320c17.7 0 32-14.3 32-32V128c0-17.7-14.3-32-32-32H64zM0 128C0 92.7 28.7 64 64 64H320c35.3 0 64 28.7 64 64v47.2V336.8 384c0 35.3-28.7 64-64 64H64c-35.3 0-64-28.7-64-64V128zM519.4 411.3L416 354.4V317.9l118.8 65.4c.9 .5 1.9 .8 3 .8c3.4 0 6.2-2.8 6.2-6.2V134.2c0-3.4-2.8-6.2-6.2-6.2c-1 0-2.1 .3-3 .8L416 194.1V157.6l103.4-56.9c5.6-3.1 12-4.7 18.4-4.7c21.1 0 38.2 17.1 38.2 38.2V377.8c0 21.1-17.1 38.2-38.2 38.2c-6.4 0-12.8-1.6-18.4-4.7z"/>
                  </svg>
                  Online-Rechtsberatung
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Nachricht;