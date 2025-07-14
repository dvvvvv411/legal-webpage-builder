import { Instagram } from "lucide-react";
import { Button } from "@/components/ui/button";

const Footer = () => {
  return (
    <footer 
      id="footer" 
      data-test-id="footer" 
      className="bg-white border-t border-t-neutral-200 border-solid"
    >
      <div className="container mx-auto px-enhanced py-12">
        <div className="flex justify-between md:items-center lg:mb-12 flex-col md:flex-row mb-8">
          <a href="https://www.anwalt.de/" className="group flex h-[40px] w-[210px] mb-8 md:mb-0">
            <span className="sr-only">Anwalt suchen und finden bei anwalt.de</span>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 371.34 70.81">
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
          
          <ul className="flex">
            <li className="md:ml-4 mr-4 md:mr-0">
              <a 
                href="https://www.facebook.com/anwalt.de" 
                target="_blank" 
                rel="noopener noreferrer"
                title="Facebook"
                className="hover:opacity-80"
              >
                <div className="w-6 h-6 rounded-full flex items-center justify-center text-white font-bold text-lg" style={{ backgroundColor: 'rgb(100, 116, 139)' }}>
                  f
                </div>
                <span className="sr-only">Facebook</span>
                <span className="sr-only">Link in einem neuen Tab öffnen</span>
              </a>
            </li>
            <li className="md:ml-4 mr-4 md:mr-0">
              <a 
                href="https://www.instagram.com/anwalt.de" 
                target="_blank" 
                rel="noopener noreferrer"
                title="Instagram"
                className="hover:opacity-80"
              >
                <Instagram className="h-6 w-6" style={{ color: 'rgb(100, 116, 139)' }} />
                <span className="sr-only">Instagram</span>
                <span className="sr-only">Link in einem neuen Tab öffnen</span>
              </a>
            </li>
            <li className="md:ml-4 mr-4 md:mr-0">
              <a 
                href="https://de.linkedin.com/company/anwaltde" 
                target="_blank" 
                rel="noopener noreferrer"
                title="Linkedin"
                className="hover:opacity-80"
              >
                <div className="w-6 h-6 rounded-sm flex items-center justify-center text-white font-bold text-sm" style={{ backgroundColor: 'rgb(100, 116, 139)' }}>
                  in
                </div>
                <span className="sr-only">Linkedin</span>
                <span className="sr-only">Link in einem neuen Tab öffnen</span>
              </a>
            </li>
          </ul>
        </div>
        
        <div className="flex justify-between flex-col md:flex-row text-sm md:text-base md:flex-wrap">
          <nav aria-labelledby="footer-nav-company" className="mb-6">
            <h6 id="footer-nav-company" className="text-neutral-600 mb-4 text-sm md:text-base font-semibold">
              Unternehmen
            </h6>
            <ul>
              <li className="mb-3">
                <a href="https://team.anwalt.de/" className="!text-neutral-600 hover:!text-info-500">
                  Über uns
                </a>
              </li>
              <li className="mb-3">
                <a href="/unternehmen/kontakt.php" className="!text-neutral-600 hover:!text-info-500">
                  Kontakt
                </a>
              </li>
              <li className="mb-0">
                <a href="/jobs" className="!text-neutral-600 hover:!text-info-500">
                  Jobs
                </a>
              </li>
            </ul>
          </nav>
          
          <nav aria-labelledby="footer-nav-products" className="mb-6">
            <h6 id="footer-nav-products" className="text-neutral-600 mb-4 text-sm md:text-base font-semibold">
              Produkte für Anwälte
            </h6>
            <ul>
              <li className="mb-3">
                <a href="https://anwalt.de/produktstufen#pricing" className="!text-neutral-600 hover:!text-info-500">
                  Produktstufen
                </a>
              </li>
              <li className="mb-3">
                <a href="/pdf/anwalt.de_preisliste.pdf" className="!text-neutral-600 hover:!text-info-500">
                  Preisliste
                </a>
              </li>
              <li className="mb-3">
                <a href="https://anwalt.de/mitmachen" className="!text-neutral-600 hover:!text-info-500">
                  Kostenlos anmelden
                </a>
              </li>
              <li className="mb-0">
                <a href="https://www.anwalt.de/kanzleiundklient" className="!text-neutral-600 hover:!text-info-500">
                  Magazin Kanzlei & Klient
                </a>
              </li>
            </ul>
          </nav>
          
          <nav aria-labelledby="footer-nav-reviews" className="mb-6">
            <h6 id="footer-nav-reviews" className="text-neutral-600 mb-4 text-sm md:text-base font-semibold">
              Bewertungen
            </h6>
            <ul>
              <li className="mb-3">
                <a href="/pdf/anwalt.de_bewertungsrichtlinien.pdf" className="!text-neutral-600 hover:!text-info-500">
                  Bewertungsrichtlinien
                </a>
              </li>
              <li className="mb-0">
                <a href="https://www.anwalt.de/bestbewertet-score" className="!text-neutral-600 hover:!text-info-500">
                  Bestbewertet-Score
                </a>
              </li>
            </ul>
          </nav>
          
          <nav aria-labelledby="footer-nav-legal" className="mb-0">
            <h6 id="footer-nav-legal" className="text-neutral-600 mb-4 text-sm md:text-base font-semibold">
              Rechtliches
            </h6>
            <ul>
              <li className="mb-3">
                <a href="/impressum" className="!text-neutral-600 hover:!text-info-500">
                  Impressum
                </a>
              </li>
              <li className="mb-3">
                <div>
                  <a href="/pdf/AGB_anwalt.de.pdf" className="!text-neutral-600 hover:!text-info-500">
                    AGB
                  </a>
                  <span className="text-neutral-600"> & </span>
                  <a href="/pdf/DSA_anwalt.de.pdf" className="!text-neutral-600 hover:!text-info-500">
                    DSA
                  </a>
                </div>
              </li>
              <li className="mb-3">
                <div>
                  <a href="/pdf/DSE_anwalt.de.pdf" className="!text-neutral-600 hover:!text-info-500">
                    Datenschutz
                  </a>
                  <span className="text-neutral-600"> & </span>
                  <a href="#" className="!text-neutral-600 hover:!text-info-500">
                    Cookies
                  </a>
                </div>
              </li>
              <li className="mb-0">
                <a href="/pdf/barrierefreiheitserklaerung_anwalt.de.pdf" className="!text-neutral-600 hover:!text-info-500">
                  Barrierefreiheit
                </a>
              </li>
            </ul>
          </nav>
          
          <div className="xl:w-[405px] mt-10 md:mt-0 w-full">
            <div className="mb-6 text-neutral-600 text-sm md:text-base md:mt-10 xl:mt-0">
              Hier bekommen Sie Recht – aktuell und schnell: Bleiben Sie auf dem Laufenden und erhalten Sie hilfreiche Infos zu rechtlichen Fallen des Alltags.
            </div>
            <div>
              <a 
                href="https://www.anwalt.de/rechtstipps/newsletter.php" 
                className="inline-block font-normal xl:w-full w-auto"
              >
                <Button variant="blue-outline" className="xl:w-full w-auto text-lg py-6 rounded-lg">
                  Zum anwalt.de-Newsletter
                </Button>
              </a>
            </div>
          </div>
        </div>
        
        <div className="border-t border-t-neutral-200 border-solid py-6 mt-9 flex flex-col md:flex-row justify-between md:items-center">
          <p className="text-base text-neutral-900">© 2004-2025</p>
          <div className="flex flex-col md:flex-row md:items-center">
            <svg width="98" height="34" className="mt-6 md:mr-12" viewBox="0 0 98 34" fill="none" xmlns="http://www.w3.org/2000/svg">
              <g clipPath="url(#clip0_318_1061)">
                <mask id="mask0_318_1061" style={{maskType:"luminance"}} maskUnits="userSpaceOnUse" x="0" y="0" width="99" height="34">
                  <path d="M98.1819 0.5H0.181885V33.5H98.1819V0.5Z" fill="white"></path>
                </mask>
                <g mask="url(#mask0_318_1061)">
                  <path d="M0.658448 0.761719L0.658447 11.5588H2.74698V0.761719H0.658448Z" fill="black"></path>
                  <path d="M0.681885 11.5703V22.3674H2.7704V11.5703H0.681885Z" fill="#C60202"></path>
                  <path d="M0.670166 22.377V33.1741H2.75869V22.377H0.670166Z" fill="#F4BA00"></path>
                  <path d="M11.4928 14.4057C10.0148 14.4057 9.0187 13.5727 8.98657 12.4193H9.75771C9.82198 13.028 10.2718 13.7649 11.4607 13.7649C12.4889 13.7649 13.0994 13.1562 13.0994 12.3873C13.0994 10.2086 9.0187 11.5863 9.0187 8.79891C9.0187 7.64551 9.9505 6.8125 11.3964 6.8125C12.8102 6.8125 13.6456 7.58143 13.7741 8.60667H12.9708C12.8745 8.09405 12.3925 7.45328 11.3643 7.45328C10.4968 7.45328 9.75771 7.93386 9.75771 8.76687C9.75771 10.9135 13.8384 9.59988 13.8384 12.3552C13.8705 13.3805 13.0672 14.4057 11.4928 14.4057Z" fill="#0F172A"></path>
                  <path d="M19.1705 7.54898H16.0537V10.3043H18.8491V10.9131H16.0537V13.7004H19.1705V14.3092H15.3147V6.9082H19.1705V7.54898Z" fill="#0F172A"></path>
                  <path d="M22.8677 6.94141C24.5706 6.94141 25.4061 7.87053 25.4061 9.08801C25.4061 10.1132 24.8277 10.9463 23.5746 11.2026L25.4703 14.3424H24.5707L22.7392 11.2666H21.3897V14.3424H20.6507V6.94141H22.8677ZM22.8677 7.55014H21.3897V10.6259H22.8998C24.1208 10.6259 24.6349 9.9851 24.6349 9.05597C24.6349 8.15888 24.1208 7.55014 22.8677 7.55014Z" fill="#0F172A"></path>
                  <path d="M31.962 6.94141H32.7331L29.9377 14.3424H29.1023L26.3069 6.94141H27.1102L29.5521 13.5414L31.962 6.94141Z" fill="#0F172A"></path>
                  <path d="M37.7134 7.54898H34.5967V10.3043H37.3921V10.9131H34.5967V13.7004H37.7134V14.3092H33.8577V6.9082H37.7134V7.54898Z" fill="#0F172A"></path>
                  <path d="M41.4076 6.94141C43.1106 6.94141 43.946 7.87053 43.946 9.08801C43.946 10.1132 43.3676 10.9463 42.1145 11.2026L44.0103 14.3424H43.1106L41.2791 11.2666H39.8975V14.3424H39.1585V6.94141H41.4076ZM41.4076 7.55014H39.9296V10.6259H41.4398C42.6608 10.6259 43.1749 9.9851 43.1749 9.05597C43.1749 8.15888 42.6608 7.55014 41.4076 7.55014Z" fill="#0F172A"></path>
                  <path d="M47.6725 14.4057C46.1945 14.4057 45.1984 13.5727 45.1663 12.4193H45.9374C46.0017 13.028 46.4515 13.7649 47.6404 13.7649C48.6686 13.7649 49.2791 13.1562 49.2791 12.3873C49.2791 10.2086 45.1984 11.5863 45.1984 8.79891C45.1984 7.64551 46.1302 6.8125 47.5761 6.8125C48.9899 6.8125 49.8253 7.58143 49.9538 8.60667H49.1505C49.0541 8.09405 48.5722 7.45328 47.544 7.45328C46.6764 7.45328 45.9374 7.93386 45.9374 8.76687C45.9374 10.9135 50.0181 9.59988 50.0181 12.3552C50.0502 13.3805 49.2148 14.4057 47.6725 14.4057Z" fill="#0F172A"></path>
                  <path d="M50.9514 6.94141H55.8032V7.55014H53.7468V14.3424H53.0078V7.55014H50.9514V6.94141Z" fill="#0F172A"></path>
                  <path d="M61.2976 12.5798H57.9238L57.2812 14.342H56.51L59.209 7.03711H60.0445L62.7435 14.342H61.9723L61.2976 12.5798ZM59.5946 7.96624L58.1166 11.9711H61.0405L59.5946 7.96624Z" fill="#0F172A"></path>
                  <path d="M69.4915 6.94141V14.3424H68.7525L64.6397 8.12684V14.3424H63.9007V6.94141H64.6397L68.7525 13.1569V6.94141H69.4915Z" fill="#0F172A"></path>
                  <path d="M77.2985 10.6579C77.2985 12.9647 75.8526 14.3424 73.3785 14.3424H71.1936V6.94141H73.3785C75.8526 6.94141 77.2985 8.31908 77.2985 10.6579ZM73.3785 13.7016C75.4671 13.7016 76.5595 12.5482 76.5595 10.6259C76.5595 8.70354 75.4992 7.51811 73.3785 7.51811H71.9326V13.6696H73.3785V13.7016Z" fill="#0F172A"></path>
                  <path d="M81.9894 14.4049C79.9009 14.4049 78.3264 12.835 78.3264 10.6243C78.3264 8.41365 79.933 6.84375 81.9894 6.84375C84.0779 6.84375 85.6523 8.41365 85.6523 10.6243C85.6523 12.835 84.0779 14.4049 81.9894 14.4049ZM81.9894 13.7641C83.6281 13.7641 84.8812 12.5787 84.8812 10.6243C84.8812 8.702 83.6281 7.51657 81.9894 7.51657C80.3507 7.51657 79.0976 8.702 79.0976 10.6243C79.0976 12.5467 80.3507 13.7641 81.9894 13.7641Z" fill="#0F172A"></path>
                  <path d="M89.2514 6.94141C90.9543 6.94141 91.7898 7.87053 91.7898 9.08801C91.7898 10.1132 91.2114 10.9463 89.9583 11.2026L91.854 14.3424H90.9543L89.1229 11.2666H87.7412V14.3424H87.0022V6.94141H89.2514ZM89.2514 7.55014H87.7734V10.6259H89.2835C90.5045 10.6259 91.0186 9.9851 91.0186 9.05597C91.0186 8.15888 90.5045 7.55014 89.2514 7.55014Z" fill="#0F172A"></path>
                  <path d="M92.721 6.94141H97.5728V7.55014H95.5164V14.3424H94.7774V7.55014H92.721V6.94141Z" fill="#0F172A"></path>
                  <path d="M15.5078 23.3767C15.5078 25.6514 13.9655 27.0291 11.5878 27.0291H9.17798V19.6602H11.5878C13.9655 19.6602 15.5078 21.1019 15.5078 23.3767ZM11.5878 26.0359C13.3229 26.0359 14.2547 25.0427 14.2547 23.3767C14.2547 21.7106 13.3229 20.6534 11.5878 20.6534H10.399V26.0359H11.5878Z" fill="#0F172A"></path>
                  <path d="M20.7782 20.6534H17.9185V22.8H20.4569V23.7932H17.9185V26.0359H20.7782V27.0291H16.6975V19.6602H20.7782V20.6534Z" fill="#0F172A"></path>
                  <path d="M22.2561 19.6602H23.4771V24.3378C23.4771 25.4912 24.1197 26.0038 25.1479 26.0038C26.1761 26.0038 26.8187 25.4592 26.8187 24.3378V19.6602H28.0397V24.3378C28.0397 26.1961 26.6902 27.0932 25.1479 27.0932C23.6056 27.0932 22.2883 26.1961 22.2883 24.3378V19.6602H22.2561Z" fill="#0F172A"></path>
                  <path d="M29.1975 19.6602H34.3385V20.6534H32.3785V27.0291H31.1575V20.6534H29.1975V19.6602Z" fill="#0F172A"></path>
                  <path d="M37.9994 27.0936C36.5213 27.0936 35.3967 26.2926 35.3967 24.979H36.682C36.7463 25.5878 37.164 26.0683 37.9994 26.0683C38.8348 26.0683 39.3167 25.6198 39.3167 24.979C39.3167 23.2169 35.3967 24.3703 35.3967 21.647C35.3967 20.3654 36.4249 19.5645 37.9351 19.5645C39.3489 19.5645 40.3449 20.3013 40.4413 21.5509H39.0918C39.0597 21.0382 38.6099 20.5897 37.8387 20.5897C37.1318 20.5577 36.5856 20.9101 36.5856 21.6149C36.5856 23.281 40.4735 22.2237 40.4735 24.9149C40.5377 26.0363 39.6381 27.0936 37.9994 27.0936Z" fill="#0F172A"></path>
                  <path d="M45.328 19.5645C46.8703 19.5645 48.1876 20.3334 48.766 21.7751H47.3201C46.9345 21.0062 46.2276 20.6217 45.3601 20.6217C43.8821 20.6217 42.8217 21.647 42.8217 23.313C42.8217 24.979 43.8821 26.0043 45.3601 26.0043C46.2276 26.0043 46.9345 25.6198 47.3201 24.8509H48.766C48.2198 26.2926 46.8703 27.0615 45.328 27.0615C43.2394 27.0615 41.5686 25.5237 41.5686 23.313C41.5686 21.1344 43.2394 19.5645 45.328 19.5645Z" fill="#0F172A"></path>
                  <path d="M54.8379 23.7932H51.3677V26.997H50.1467V19.6602H51.3677V22.8H54.8379V19.6602H56.0589V26.997H54.8379V23.7932Z" fill="#0F172A"></path>
                  <path d="M58.8551 19.6602V26.0359H61.3614V26.997H57.6663V19.6602H58.8551Z" fill="#0F172A"></path>
                  <path d="M66.7923 25.5233H63.7077L63.1615 27.0291H61.9084L64.5431 19.6602H65.9569L68.5916 27.0291H67.3064L66.7923 25.5233ZM65.25 21.1019L64.029 24.5301H66.4389L65.25 21.1019Z" fill="#0F172A"></path>
                  <path d="M75.7859 19.6602V27.0291H74.565L70.9341 21.5504V27.0291H69.7131V19.6602H70.9341L74.565 25.1388V19.6602H75.7859Z" fill="#0F172A"></path>
                  <path d="M83.6914 23.3767C83.6914 25.6514 82.1491 27.0291 79.7714 27.0291H77.3616V19.6602H79.7714C82.1491 19.6602 83.6914 21.1019 83.6914 23.3767ZM79.7714 26.0359C81.5065 26.0359 82.4383 25.0427 82.4383 23.3767C82.4383 21.7106 81.5065 20.6534 79.7714 20.6534H78.5826V26.0359H79.7714Z" fill="#0F172A"></path>
                </g>
              </g>
              <defs>
                <clipPath id="clip0_318_1061">
                  <rect width="98" height="33" fill="white" transform="translate(0 0.5)"></rect>
                </clipPath>
              </defs>
            </svg>
            
            <div className="inline-flex items-center gap-4 mt-6">
              <img 
                src="/lovable-uploads/c30a1ab8-760e-4fca-989b-73eec358123b.png" 
                alt="Google Logo" 
                width="57" 
                height="57" 
                className="w-14 h-14" 
              />
              <div className="grid justify-items-start">
                <div className="text-xs text-neutral-900">Google Bewertungen</div>
                <div className="flex gap-1.5">
                  <span className="text-lg font-bold text-neutral-900">4.6</span>
                  <div className="my-1 flex text-amber-400">
                    <svg className="h-[1.375rem] w-auto fill-current" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 42 42">
                      <path d="M8.65653 37.9894L21 29.925V0L15.754 13.7795L1.02783 14.5106L12.5118 23.758L8.65653 37.9894Z"></path>
                      <path d="M33.3435 37.9894L21 29.925V0L26.246 13.7795L40.9722 14.5106L29.4882 23.758L33.3435 37.9894Z"></path>
                    </svg>
                    <svg className="h-[1.375rem] w-auto fill-current" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 42 42">
                      <path d="M8.65653 37.9894L21 29.925V0L15.754 13.7795L1.02783 14.5106L12.5118 23.758L8.65653 37.9894Z"></path>
                      <path d="M33.3435 37.9894L21 29.925V0L26.246 13.7795L40.9722 14.5106L29.4882 23.758L33.3435 37.9894Z"></path>
                    </svg>
                    <svg className="h-[1.375rem] w-auto fill-current" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 42 42">
                      <path d="M8.65653 37.9894L21 29.925V0L15.754 13.7795L1.02783 14.5106L12.5118 23.758L8.65653 37.9894Z"></path>
                      <path d="M33.3435 37.9894L21 29.925V0L26.246 13.7795L40.9722 14.5106L29.4882 23.758L33.3435 37.9894Z"></path>
                    </svg>
                    <svg className="h-[1.375rem] w-auto fill-current" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 42 42">
                      <path d="M8.65653 37.9894L21 29.925V0L15.754 13.7795L1.02783 14.5106L12.5118 23.758L8.65653 37.9894Z"></path>
                      <path d="M33.3435 37.9894L21 29.925V0L26.246 13.7795L40.9722 14.5106L29.4882 23.758L33.3435 37.9894Z"></path>
                    </svg>
                    <svg className="h-[1.375rem] w-auto" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 42 42">
                      <path className="fill-current" d="M8.65653 37.9894L21 29.925V0L15.754 13.7795L1.02783 14.5106L12.5118 23.758L8.65653 37.9894Z"></path>
                      <path className="fill-current text-neutral-300" d="M33.3435 37.9894L21 29.925V0L26.246 13.7795L40.9722 14.5106L29.4882 23.758L33.3435 37.9894Z"></path>
                    </svg>
                  </div>
                </div>
                <div className="text-xs font-semibold text-neutral-900">Basierend auf 349 Bewertungen</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;