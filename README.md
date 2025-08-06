# PricePal

A modern web application that helps users compare prices across multiple e-commerce platforms to find the best deals on products and groceries.

## Features

- **Multi-Platform Price Comparison**: Compare prices across Amazon, Flipkart, Blinkit, Zepto, and Swiggy
- **Category-Based Search**: Separate search functionality for products and groceries
- **Real-Time Scraping**: Live price data fetched directly from e-commerce platforms
- **Responsive Design**: Modern, mobile-friendly interface built with Tailwind CSS
- **Dark/Light Theme**: Theme switching capability with next-themes
- **Type-Safe**: Built with TypeScript for enhanced development experience

## Tech Stack

- **Framework**: Next.js 15.2.4 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS with shadcn/ui components
- **Web Scraping**: Puppeteer for automated data extraction
- **State Management**: React hooks and form handling with react-hook-form
- **Validation**: Zod for schema validation
- **Package Manager**: pnpm

## Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd pricepal
```

2. Install dependencies:
```bash
pnpm install
```

3. Run the development server:
```bash
pnpm dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Usage

1. Navigate to the product search page
2. Select a category (Products or Grocery)
3. Enter your search term
4. View price comparisons across multiple platforms
5. Click on results to visit the respective platform

## Supported Platforms

### Products
- Amazon
- Flipkart

### Groceries
- Swiggy Instamart
- Blinkit
- Zepto

## Project Structure

```
├── app/                    # Next.js app directory
│   ├── api/               # API routes
│   ├── product-search/    # Product search page
│   └── ...
├── components/            # Reusable UI components
│   └── ui/               # shadcn/ui components
├── lib/                  # Utility libraries
│   ├── scrapers/         # Platform-specific scrapers
│   └── types.ts          # TypeScript type definitions
├── hooks/                # Custom React hooks
└── public/               # Static assets
```

## Scripts

- `pnpm dev` - Start development server
- `pnpm build` - Build for production
- `pnpm start` - Start production server
- `pnpm lint` - Run ESLint

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## Disclaimer

This application is for educational and research purposes. Please respect the terms of service of the platforms being scraped and use responsibly.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.