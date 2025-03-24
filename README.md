# MaCosplay - Open Source Cosplay Platform

<p align="center">
  <img src="./static/images/Example/Macosplay.png" alt="MaCosplay Logo" width="200"/>
</p>

<p align="center">
  <a href="https://macosplay.com">Website</a> •
  <a href="https://github.com/idea2547/MaCosplay">Source Code</a> •
  <a href="https://discord.gg/vbrKE7WCXZ">Discord</a> •
  <a href="https://www.facebook.com/profile.php?id=61571822900726">Facebook</a>
</p>

<!-- Tech Stack Badges -->
<p align="center">
  <a href="https://kit.svelte.dev/"><img src="https://img.shields.io/badge/SvelteKit-FF3E00?style=for-the-badge&logo=svelte&logoColor=white" alt="SvelteKit"/></a>
  <a href="https://pocketbase.io/"><img src="https://img.shields.io/badge/PocketBase-B8DBE4?style=for-the-badge&logo=pocketbase&logoColor=black" alt="PocketBase"/></a>
  <a href="https://tailwindcss.com/"><img src="https://img.shields.io/badge/tailwindcss-%2338B2AC.svg?style=for-the-badge&logo=tailwind-css&logoColor=white" alt="TailwindCSS"/></a>
  <a href="https://daisyui.com/"><img src="https://img.shields.io/badge/daisyUI-5A0EF8?style=for-the-badge&logo=daisyui&logoColor=white" alt="DaisyUI"/></a>
  <a href="https://pages.cloudflare.com/"><img src="https://img.shields.io/badge/Cloudflare-F38020?style=for-the-badge&logo=Cloudflare&logoColor=white" alt="Cloudflare"/></a>
</p>

<!-- GitHub Badges -->
<p align="center">
  <a href="https://github.com/idea2547/MaCosplay/stargazers"><img src="https://img.shields.io/github/stars/idea2547/MaCosplay?style=for-the-badge" alt="Stars"/></a>
  <a href="https://github.com/idea2547/MaCosplay/network/members"><img src="https://img.shields.io/github/forks/idea2547/MaCosplay?style=for-the-badge" alt="Forks"/></a>
  <a href="https://github.com/idea2547/MaCosplay/issues"><img src="https://img.shields.io/github/issues/idea2547/MaCosplay?style=for-the-badge" alt="Issues"/></a>
  <a href="https://github.com/idea2547/MaCosplay/blob/master/LICENSE"><img src="https://img.shields.io/github/license/idea2547/MaCosplay?style=for-the-badge" alt="License"/></a>
</p>

<!-- Social Badges -->
<p align="center">
  <a href="https://discord.gg/vbrKE7WCXZ"><img src="https://img.shields.io/badge/Discord-%235865F2.svg?style=for-the-badge&logo=discord&logoColor=white" alt="Discord"/></a>
  <a href="https://www.facebook.com/profile.php?id=61571822900726"><img src="https://img.shields.io/badge/Facebook-%231877F2.svg?style=for-the-badge&logo=Facebook&logoColor=white" alt="Facebook"/></a>
</p>

## 📖 Overview

MaCosplay เป็นแพลตฟอร์ม Open-Source สำหรับชุมชนคอสเพลย์ ที่เปิดให้ทดลองใช้งานแล้ว และมีผู้ลงทะเบียนกว่า 200 คน! 🎉

MaCosplay connects cosplayers looking to rent costumes with costume owners across Thailand. With easy-to-use features and secure transactions, you can list your costumes for rent or find the perfect outfit for events or photoshoots.

## 🚀 Motivation

MaCosplay was created to solve common challenges in the cosplay community:

- Limited access to high-quality costumes
- Difficulty finding specific character outfits
- High costs of creating one-time costumes
- Lack of a dedicated platform for cosplay resource sharing

By creating an open-source platform, we aim to build a thriving ecosystem where cosplayers can share resources, knowledge, and costumes.

## 🌟 Features

- **เช่าชุดคอสเพลย์**: ค้นหาและเช่าชุดคอสเพลย์ที่คุณชื่นชอบ
- **แชร์ไอเดีย**: แบ่งปันแพทเทิร์น, ไกด์, และเทคนิคการทำคอสเพลย์
- **ชุมชน**: เชื่อมต่อกับคอสเพลย์เยอร์ทั่วโลกและแชร์ผลงานของคุณ
- **ทรัพยากร**: เข้าถึงฐานข้อมูลของชุดคอสเพลย์และอุปกรณ์

## 🖼️ Screenshots

<p align="center">
  <img src="./static/images/screens/macosplay-main-page.png" alt="MaCosplay Screenshot" width="400"/>
  <img src="./static/images/screens/macosplay-search-page.png" alt="MaCosplay Screenshot" width="400"/>
</p>

## 🧩 Why Open Source?

- **การมีส่วนร่วมทั่วโลก**: นักพัฒนาทั่วโลกสามารถเข้ามาช่วยพัฒนาได้
- **ประโยชน์ต่อชุมชน**: คอสเพลย์เยอร์จะได้ใช้แพลตฟอร์มที่ดียิ่งขึ้น
- **การพัฒนาที่รวดเร็ว**: โปรเจกต์เติบโตและพัฒนาได้อย่างรวดเร็ว

## 💻 Tech Stack

| Component    | Technology           |
| ------------ | -------------------- |
| **Frontend** | SvelteKit            |
| **Backend**  | PocketBase           |
| **UI**       | DaisyUI, TailwindCSS |
| **Hosting**  | Cloudflare Pages     |

## 🛠️ Getting Started

### Prerequisites

- Node.js (v18 or higher)
- Yarn or npm
- Git
- [PocketBase](https://pocketbase.io/docs/) (for local development) / PocketBase v0.22.27: Download the executable for your platform

### Installation

```bash
# Clone the repository
git clone https://github.com/idea2547/MaCosplay.git
cd MaCosplay

# Install dependencies
yarn install
# or if using npm
npm install
```

### Environment Setup

1. Copy the example environment file:

   ```bash
   cp .env.example .env
   ```

2. Update the `.env` file with your configuration:

   ```
   PUBLIC_POCKETBASE_URL=your_pocketbase_url
   # PocketBase Configuration
    VITE_PB_URL=http://127.0.0.1:8090              # Your PocketBase instance URL
    VITE_AUTH_ADMIN_NAME=admin                    # PocketBase admin username
    VITE_AUTH_ADMIN_PASS=securepassword123        # PocketBase admin password

    # Facebook OAuth (optional, for social login)
    VITE_FB_CLIENT_ID=your_app_id                 # From Facebook Developer App
    VITE_FB_CLIENT_SECRET=your_app_secret         # From Facebook Developer App

    # Base URL for Development
    VITE_BASE_URL=http://localhost:5173           # Local development URL

    # Stripe Payments (optional, for payment features)
    VITE_STRIPE_SECRET_KEY=sk_test_xxx            # From Stripe Dashboard
    VITE_STRIPE_WEBHOOK_KEY=whsec_xxx             # From Stripe Dashboard

    # AI Integration (optional, for image upscaling)
    VITE_REPLICATE_API_TOKEN=your_replicate_key   # From Replicate API

    # Deployment Settings
    NODE_ENV=development                          # Set to 'production' for prod builds
    PORT=5173                                     # Local server port
    # PUBLIC_SITE_URL=https://macosplay.com       # Uncomment and update for production
   ```

### Running the Application

Import Collections:
Download pb_schema.json from this [https://gist.github.com/idea2547/a26283693b013ce1c34d32f41e8244bd].

In the PocketBase admin UI, go to Settings > Import Collections.

Upload pb_schema.json to set up the required database structure.

#### Development Mode

```bash
# Start the development server
yarn dev
# or
npm run dev

# Open http://localhost:5173 in your browser
```

#### Production Build

```bash
# Create a production build
yarn build
# or
npm run build

# Preview the production build locally
yarn preview
# or
npm run preview
```

### Setting Up PocketBase

1. [Download PocketBase](https://pocketbase.io/docs/) for your platform
2. Extract and run the PocketBase executable
3. Access the admin dashboard at `http://127.0.0.1:8090/_/`
4. Create a new admin account
5. Import our schema from the `pocketbase-schema.json` file (if available)
6. Update your `.env` file with `PUBLIC_POCKETBASE_URL=http://127.0.0.1:8090`

## 📱 How to Use

1. **Create an Account**: Sign up on [MaCosplay](https://macosplay.com)
2. **Browse Costumes**: Search for costumes by character, series, or size
3. **Rent a Costume**: Select dates and make a request
4. **List Your Costume**: Add photos, description, and set your rental terms

## 🧪 Testing

```bash
# Run unit tests
yarn test

# Run e2e tests
yarn test:e2e
```

## 👥 How to Contribute

We welcome contributions from developers and cosplayers alike! Check out our [Contributing Guide](CONTRIBUTING.md) for detailed instructions on how to get started.

### Quick Start for Contributors

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'feat: add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📜 Project Structure

This project follows the [SvelteKit project structure](https://svelte.dev/docs/kit/project-structure).

```
├── src/
│   ├── lib/           # Library code (components, utilities)
│   ├── routes/        # SvelteKit routes
│   └── app.html       # HTML template
├── static/            # Static assets
├── tests/             # Test files
└── package.json       # Project dependencies
```

## 🌐 Community

- [Discord](https://discord.gg/vbrKE7WCXZ) - Join our community chat
- [Facebook](https://www.facebook.com/profile.php?id=61571822900726) - Follow us for updates
- [GitHub Issues](https://github.com/idea2547/MaCosplay/issues) - Report bugs or request features

## 👥 Contributors

<table>
<tr>
    <td align="center" style="word-wrap: break-word; width: 150.0; height: 150.0">
        <a href=https://github.com/idea2547>
            <img src=https://avatars.githubusercontent.com/u/53974956?v=4 width="100;"  style="border-radius:50%;align-items:center;justify-content:center;overflow:hidden;padding-top:10px" alt=Idea RC/>
            <br />
            <sub style="font-size:14px"><b>Idea RC</b></sub>
        </a>
    </td>
    <td align="center" style="word-wrap: break-word; width: 150.0; height: 150.0">
        <a href=https://github.com/boomNDS>
            <img src=https://avatars.githubusercontent.com/u/5331334?v=4 width="100;"  style="border-radius:50%;align-items:center;justify-content:center;overflow:hidden;padding-top:10px" alt=Pach0n/>
            <br />
            <sub style="font-size:14px"><b>Pach0n</b></sub>
        </a>
    </td>
</tr>
</table>

## 🔮 Roadmap

- [x] Launch MVP version
- [x] Reach 200+ registered users

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Project backed by: Otakuspace
- Special thanks to all contributors and the cosplay community
- Inspired by the global cosplay community's needs

---

<p align="center">
  Made with ❤️ for cosplayers, by cosplayers (and developers)
</p>
