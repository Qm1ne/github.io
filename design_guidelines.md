# AI Automation Agency Website - Design Guidelines

## Design Approach
**Reference-Based Design**: Drawing inspiration from Axe Automation's professional, business-oriented aesthetic. Clean, modern B2B SaaS approach with emphasis on credibility, clarity, and conversion optimization.

## Typography Hierarchy
- **Hero Headline**: Extra large, bold weight (text-5xl to text-6xl on desktop)
- **Section Headers**: Large, semibold (text-3xl to text-4xl)
- **Card Titles**: Medium, semibold (text-xl to text-2xl)
- **Body Text**: Base size, regular weight with generous line-height (1.6-1.8)
- **Button Text**: Medium, semibold with uppercase tracking for primary CTAs
- **Font Stack**: Modern sans-serif via Google Fonts (e.g., Inter, DM Sans, or similar professional typeface)

## Layout System & Spacing
**Spacing Units**: Use Tailwind spacing of 4, 6, 8, 12, 16, 20, and 24 for consistency
- Section vertical padding: py-16 to py-24 on desktop, py-12 on mobile
- Container max-width: max-w-7xl with horizontal padding px-6
- Card spacing: gap-6 to gap-8 in grids
- Form field spacing: space-y-6

## Navigation Bar
- Sticky positioning (sticky top-0) with subtle backdrop blur
- Height: h-20
- Left-aligned agency name/logo with medium-large text
- Right-aligned action buttons: "Book Consultation" (primary CTA) and "Contact Us" (secondary)
- Smooth scroll behavior for Contact Us anchor
- Desktop: horizontal layout, Mobile: hamburger menu with slide-in drawer

## Hero Section
**Layout**: Full-width section with large hero image as background
- Image: Professional office/team workspace or abstract tech visualization, with subtle dark overlay for text readability
- Content centered vertically and horizontally
- Headline: 1-2 lines, attention-grabbing value proposition
- Subtext: 1-2 sentences, max-w-2xl, supporting detail
- Primary CTA button with blurred background (backdrop-blur-sm bg-white/20 or similar)
- Minimum height: min-h-[600px] on desktop, min-h-[500px] on mobile

## Services Section
**Grid Layout**: 4-column on desktop (lg:grid-cols-4), 2-column on tablet (md:grid-cols-2), 1-column on mobile
- Each card: rounded corners, subtle border, padding p-6 to p-8
- Icon at top (from Heroicons or Font Awesome)
- Card title below icon
- Brief description (2-3 lines)
- Hover state: subtle lift effect (transform translate-y-1)
- Services: AI Workflows, CRM Integration, Lead Generation, n8n/Make Consulting

## Banner Section
**Full-width impactful section**
- Gradient background OR large background image
- Centered short tagline (1 line, bold, large text)
- Optional secondary CTA
- Padding: py-20 to py-32
- Text overlay with high contrast

## Testimonials Section
**Slider/Carousel Layout**
- 3 testimonial cards visible on desktop, 1 on mobile
- Each card: client quote, name, company, optional avatar placeholder
- Left/right arrow navigation buttons positioned at card edges
- Card design: rounded, elevated with shadow
- Auto-rotate optional with pause on hover
- Dots indicator below for slide position

## Case Studies/Resources Section
**2-3 column grid** (lg:grid-cols-3 md:grid-cols-2)
- Card-based layout for blog posts/podcast links
- Thumbnail image at top (16:9 aspect ratio)
- Title, brief excerpt, "Read More" or "Listen" link
- Minimum 3 placeholder cards
- Consistent card heights with object-fit for images

## Contact Section
**2-column layout** on desktop: Form (left 60%) + Supporting info/map placeholder (right 40%)
- Form fields: Name, Email, Phone Number, Message (textarea)
- Each field: full-width, consistent height (h-12 for inputs), rounded borders
- Message field: h-32 minimum
- Submit button: full-width or right-aligned, primary style
- Form validation states (visual indicators)
- Supporting column: office location, contact details, business hours

## Footer
**3-section horizontal layout**
- Left: Agency name/logo with tagline
- Center: Quick links (Services, Resources, Contact)
- Right: Social media icons (LinkedIn, Twitter, Facebook - icon links)
- Bottom strip: Copyright text centered
- Padding: py-12 to py-16
- Mobile: stacked single column

## Animations & Interactions
- Fade-in on scroll for sections (subtle, once per session)
- Smooth scroll for anchor links
- Button hover: slight scale (scale-105) and shadow increase
- Card hover: transform translateY(-4px) with shadow enhancement
- Navigation: smooth slide-in for mobile menu
- Keep animations minimal and professional

## Component Library
- **Buttons**: Rounded (rounded-md to rounded-lg), padding px-6 py-3, clear hover states
- **Cards**: Rounded corners (rounded-lg), subtle borders, consistent padding
- **Form Inputs**: Rounded borders, focus rings, consistent sizing
- **Icons**: Single icon library (Heroicons recommended), size-6 or size-8

## Images
**Hero Section**: Large background image - modern office space, team collaboration, or abstract technology/AI visualization with dark overlay (opacity-50 to opacity-60) for text contrast

**Banner Section**: Optional large image or gradient background

**Case Studies/Resources**: Thumbnail images for each blog/podcast card (16:9 ratio)

**Testimonials**: Optional small circular avatars for clients

## Responsive Breakpoints
- Mobile-first approach
- Breakpoints: sm (640px), md (768px), lg (1024px), xl (1280px)
- Navigation: Full menu on lg+, hamburger below
- Grids: Stack to single column on mobile, expand on larger screens
- Hero text: Scale down on mobile (text-4xl → text-3xl)

## Key Design Principles
1. **Professional Trust**: Clean layouts, ample whitespace, credible presentation
2. **Conversion-Focused**: Clear CTAs, minimal friction, strategic button placement
3. **Visual Hierarchy**: Size, weight, and spacing guide user attention
4. **Consistency**: Repeating patterns, unified spacing, cohesive component design