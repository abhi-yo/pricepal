import { Geist } from "next/font/google";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { EtheralShadow } from "./ui/etheral-shadow";

// Fonts
const geist = Geist({
  subsets: ["latin"],
  display: "swap",
});

export default function Hero() {
  return (
    <EtheralShadow 
      color="#000000"
      animation={{ scale: 100, speed: 90 }}
      noise={{ opacity: 2, scale: 1.2 }}
      sizing="fill"
      style={{ minHeight: '100vh' }}


    >
      
      <div className="relative z-10 flex flex-col min-h-screen">
        <header className="w-full">
          <nav className="container mx-auto px-6 py-6">
            <div className="flex items-center justify-between">
              <div className={`${geist.className} text-lg font-medium text-theme-text-primary`}>
                Price Pal
              </div>
              <div className="hidden md:flex items-center space-x-8">
                {["About", "Contact"].map((item) => {
                  if (item === 'Contact') {
                    return (
                      <a
                        key={item}
                        href="https://www.akshatsingh.xyz/"
                        target="_blank"
                        rel="noopener noreferrer"
                        className={`${geist.className} text-sm text-theme-text-secondary hover:text-theme-text-primary transition-colors`}
                      >
                        {item}
                      </a>
                    )
                  }
                  
                  const href = `/${item.toLowerCase()}`;
                  return (
                    <Link
                      key={item}
                      href={href}
                      className={`${geist.className} text-sm text-theme-text-secondary hover:text-theme-text-primary transition-colors`}
                    >
                      {item}
                    </Link>
                  )
                })}
              </div>
            </div>
          </nav>
        </header>

        <div className="flex-1 flex items-center justify-center">
          <div className="container mx-auto px-6">
            <div className="max-w-4xl mx-auto text-center space-y-6 py-12">
              <h1
                className={`${geist.className} text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-light tracking-tight text-theme-text-primary leading-tight`}
              >
                Your Personal Deal Detective
              </h1>
              <p
                className={`${geist.className} text-lg md:text-xl text-theme-text-secondary max-w-2xl mx-auto leading-relaxed`}
              >
                Stop overpaying. We find the best deals for you, so you can shop smart and save big.
              </p>
              <div className="flex flex-col sm:flex-row justify-center gap-4 pt-6">
                <Button asChild className="bg-theme-primary text-theme-text-primary border-0 rounded-full px-9 py-4 font-light transition-all duration-300 hover:bg-theme-primary hover:shadow-[0_0_20px_0px_theme(colors.theme.primary/0.5)]">
                  <Link href="/product-search">
                    Find a Deal
                  </Link>
                </Button>
                <Button
                  variant="outline"
                  className="border-theme-secondary/80 text-theme-text-secondary hover:bg-theme-secondary/50 hover:text-theme-text-primary bg-transparent backdrop-blur-sm rounded-full px-9 py-4 font-light transition-colors"
                >
                  Learn More
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </EtheralShadow>
  );
}
