import { useState } from "react";
import { ChevronLeft, ChevronRight, ChevronDown, LockKeyhole, Scale, Star, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

const BewertungSchreiben = () => {
  const [step, setStep] = useState(1);
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [reviewTitle, setReviewTitle] = useState("");
  const [reviewText, setReviewText] = useState("");
  const [gender, setGender] = useState("");
  const [firstname, setFirstname] = useState("");
  const [lastname, setLastname] = useState("");
  const [email, setEmail] = useState("");
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [selectedLegalArea, setSelectedLegalArea] = useState("Allgemeine Rechtsberatung");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [titleTouched, setTitleTouched] = useState(false);
  const [textTouched, setTextTouched] = useState(false);
  const navigate = useNavigate();

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
            <img 
              className="img-fluid" 
              width="130" 
              height="25" 
              src="https://www.anwalt.de/img/anwalt.de-logo.svg" 
              alt="Anwalt.de"
            />
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
              <span className={step === 1 ? "text-black text-sm font-medium" : "text-neutral-500 text-sm"}>
                Kanzlei bewerten
              </span>
              <ChevronRight className="ml-4 text-neutral-500" size={16} />
            </li>
            <li className="flex items-center">
              <span className={step === 2 ? "text-black text-sm font-medium" : "text-neutral-500 text-sm"}>Bewertung vervollständigen</span>
              <ChevronRight className="ml-4 text-neutral-500" size={16} />
            </li>
            <li>
              <span className={step === 3 ? "text-black text-sm font-medium" : "text-neutral-500 text-sm"}>Bewertung bestätigen</span>
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
                  <h1 className="text-2xl font-bold mb-6 leading-8">
                    Bewerten Sie Steinbock & Partner Rechtsanwaltskanzlei Fachanwälte - Steuerberater
                  </h1>

                  <div className="mb-9">
                    {/* Star Rating */}
                    <div className="mb-8">
                      <label className="text-neutral-700 text-base mb-4 block">
                        Wie bewerten Sie die Kanzlei?
                      </label>
                      <div className="flex gap-1 mb-2">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <button
                            key={star}
                            type="button"
                            onClick={() => setRating(star)}
                            onMouseEnter={() => setHoverRating(star)}
                            onMouseLeave={() => setHoverRating(0)}
                            className="transition-colors"
                          >
                            <Star
                              size={39}
                              strokeWidth={0.2}
                              className={`${
                                star <= (hoverRating || rating)
                                  ? "fill-amber-400 text-amber-400"
                                  : "fill-[#cbd5e1] text-[#cbd5e1]"
                              }`}
                            />
                          </button>
                        ))}
                      </div>
                      {rating > 0 && (
                        <p className="text-sm text-neutral-600">
                          Sie haben {rating} von 5 Sternen vergeben
                        </p>
                      )}
                    </div>

                    {/* Legal Area Selection */}
                    <div className="mb-6">
                      <label className="text-neutral-700 text-base mb-3 block">
                        Um welches Rechtsgebiet handelte es sich?
                      </label>
                      <div className="relative">
                        <button
                          type="button"
                          onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                          className="w-full px-4 py-3 border-0 rounded-md focus:outline-none bg-card-input-bg text-left flex justify-between items-center"
                        >
                          {selectedLegalArea}
                          <ChevronDown size={16} />
                        </button>
                        {isDropdownOpen && (
                          <div className="absolute z-50 w-full mt-1 bg-white border border-neutral-400 rounded max-h-52 overflow-y-auto shadow-lg">
                            <ul className="list-none p-0">
                              {[
                                "Allgemeine Rechtsberatung", "Allgemeines Vertragsrecht", "Arbeitsrecht", "Arzthaftungsrecht",
                                "Baurecht & Architektenrecht", "Datenschutzrecht", "Erbrecht", "Familienrecht",
                                "Forderungseinzug & Inkassorecht", "Gewerblicher Rechtsschutz", "Grundstücksrecht & Immobilienrecht",
                                "Handelsrecht & Gesellschaftsrecht", "Insolvenzrecht & Sanierungsrecht", "Maklerrecht",
                                "Markenrecht", "Medizinrecht", "Mietrecht & Wohnungseigentumsrecht", "Ordnungswidrigkeitenrecht",
                                "Schadensersatzrecht & Schmerzensgeldrecht", "Sozialrecht", "Sportrecht", "Steuerrecht",
                                "Strafrecht", "Urheberrecht & Medienrecht", "Vereinsrecht & Verbandsrecht", "Verkehrsrecht",
                                "Versicherungsrecht", "Verwaltungsrecht", "Wirtschaftsrecht", "Zivilrecht", "Zwangsvollstreckungsrecht"
                              ].map((area) => (
                                <li key={area}>
                                  <button
                                    type="button"
                                    onClick={() => {
                                      setSelectedLegalArea(area);
                                      setIsDropdownOpen(false);
                                    }}
                                    className="w-full text-left px-4 py-2 hover:bg-gray-100"
                                  >
                                    {area}
                                  </button>
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Review Title */}
                    <div className="mb-6">
                      <div className="relative">
                        <input
                          id="reviewTitle"
                          type="text"
                          value={reviewTitle}
                          onChange={(e) => setReviewTitle(e.target.value)}
                          onBlur={() => setTitleTouched(true)}
                          className={`w-full px-4 py-3 border-0 rounded-md focus:outline-none peer ${
                            titleTouched && !reviewTitle.trim() 
                              ? 'bg-red-50 text-red-900 ring-1 ring-red-500' 
                              : 'bg-card-input-bg'
                          }`}
                          placeholder=" "
                        />
                        <label
                          htmlFor="reviewTitle"
                          className={`absolute text-sm duration-300 transform -translate-y-4 scale-75 top-2 z-10 origin-[0] px-2 peer-focus:px-2 peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-4 left-1 ${
                            titleTouched && !reviewTitle.trim()
                              ? 'text-red-500 bg-red-50'
                              : 'text-gray-500 bg-card-input-bg'
                          }`}
                        >
                          Überschrift Ihrer Bewertung
                        </label>
                      </div>
                      {titleTouched && !reviewTitle.trim() && (
                        <p className="text-red-500 text-sm mt-1">Diese Angabe ist erforderlich.</p>
                      )}
                    </div>

                    {/* Review Text */}
                    <div className="mb-2">
                      <div className="relative">
                        <textarea
                          id="reviewText"
                          rows={6}
                          value={reviewText}
                          onChange={(e) => setReviewText(e.target.value)}
                          onBlur={() => setTextTouched(true)}
                          maxLength={maxLength}
                          className={`w-full px-4 py-3 border-0 rounded-md focus:outline-none resize-vertical min-h-[150px] peer ${
                            textTouched && !reviewText.trim()
                              ? 'bg-red-50 text-red-900 ring-1 ring-red-500'
                              : 'bg-card-input-bg'
                          }`}
                          placeholder=" "
                        />
                        <label
                          htmlFor="reviewText"
                          className={`absolute text-sm duration-300 transform -translate-y-4 scale-75 top-2 z-10 origin-[0] px-2 peer-focus:px-2 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-placeholder-shown:top-4 peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-4 left-1 ${
                            textTouched && !reviewText.trim()
                              ? 'text-red-500 bg-red-50'
                              : 'text-gray-500 bg-card-input-bg'
                          }`}
                        >
                          Beschreiben Sie Ihre Erfahrung
                        </label>
                      </div>
                      {textTouched && !reviewText.trim() && (
                        <p className="text-red-500 text-sm mt-1">Diese Angabe ist erforderlich.</p>
                      )}
                    </div>
                  </div>
                </>
              ) : step === 2 ? (
                <>
                  <h1 className="text-2xl font-semibold mb-8 leading-8">
                    Kontaktdaten
                  </h1>

                  <div>
                    {/* Anonymous Checkbox */}
                    <div className="mb-6">
                      <div className="flex items-center">
                        <input
                          id="anonymous"
                          name="anonymous"
                          type="checkbox"
                          checked={isAnonymous}
                          onChange={(e) => setIsAnonymous(e.target.checked)}
                          className="w-4 h-4 text-radio-blue bg-gray-100 border-gray-300 rounded focus:ring-radio-blue focus:ring-2"
                        />
                        <label htmlFor="anonymous" className="ml-2 text-neutral-900">
                          Bewertung anonym abgeben
                        </label>
                      </div>
                    </div>

                    {!isAnonymous && (
                      <>
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
                      </>
                    )}

                    {/* Email Field */}
                    <div className="relative mb-6">
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
                        E-Mail-Adresse *
                      </label>
                    </div>

                    {/* Terms and Privacy */}
                    <p className="text-neutral-700 text-base mb-9">
                      Mit Klick auf „Bewertung abschicken" akzeptieren Sie die{" "}
                      <a
                        target="_blank"
                        href="/pdf/anwalt.de_bewertungsrichtlinien.pdf"
                        className="underline"
                      >
                        Bewertungsrichtlinien
                      </a>{" "}
                      und unsere{" "}
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
                    <h1 className="text-2xl font-semibold mb-6 leading-8">
                      Bewertung erfolgreich abgeschickt
                    </h1>
                    <p className="mb-3 text-neutral-600">
                      Vielen Dank für Ihre Bewertung!
                    </p>
                    <p className="mb-3 text-neutral-600">
                      Ihre Bewertung wird nach einer kurzen Prüfung veröffentlicht. Sie erhalten eine Bestätigung an <span className="font-semibold">{email}</span>.
                    </p>
                  </div>
                </>
              )}

              {/* Action Buttons */}
              {step < 3 && (
                <div className="md:flex md:justify-between mt-3">
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
                    disabled={step === 1 && (rating === 0 || !reviewTitle.trim() || !reviewText.trim())}
                  >
                    {step === 1 ? "Weiter" : "Bewertung abschicken"}
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
                    alt="Bild von Steinbock & Partner Rechtsanwaltskanzlei Fachanwälte - Steuerberater"
                    src="https://www.anwalt.de/cdn-cgi/image/format=auto,fit=scale-down,width=80,height=80/upload/company/9b/9bde51a88bde31ae1c0ce33c48ff0b98/Logo-Quadrat_RGB-300ppi_Anwaelte_62c6ff9ca63946.09830762.jpg"
                    className="rounded-xl"
                    height="80"
                    width="80"
                  />
                </figure>
                <div>
                  <span
                    title="Steinbock & Partner Rechtsanwaltskanzlei Fachanwälte - Steuerberater"
                    className="text-black text-lg font-semibold"
                  >
                    Steinbock & Partner Rechtsanwaltskanzlei Fachanwälte - Steuerberater
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
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BewertungSchreiben;