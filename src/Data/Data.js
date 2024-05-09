// Sidebar imports

// Analytics Cards imports
// import { keyboard } from "@testing-library/user-event/dist/keyboard";

// Recent Card Imports
import img1 from "../imgs/img1.png";
import img2 from "../imgs/img2.png";
import img3 from "../imgs/img3.png";

// Sidebar Data
export const SidebarData = [
  {
    icon: "far fa-house",
    heading: "Dashboard",
    headingThai: "หน้าแรก"
  },
  {
    icon: "far fa-receipt",
    heading: "Transactions",
    headingThai: "ธุรกรรม"
  },
  {
    icon: "far fa-wallet",
    heading: "Wallets",
    headingThai: "กระเป๋าสตางค์"
  },
  {
    icon: "far fa-chart-pie",
    heading: 'Analytic',
    headingThai: "การวิเคราะห์"
  },
  {
    icon: "far fa-user",
    heading: 'Profile',
    headingThai: "โปรไฟล์"
  },
  {
    icon: "far fa-cog",
    heading: 'Settings',
    headingThai: "ตั้งค่า"
  },
  {
    icon: "fad fa-crown text-golden-600",
    heading: 'Premium',
    headingThai: "พรีเมี่ยม"
  },
  {
    icon: "far fa-right-from-bracket",
    heading: 'Signout',
    headingThai: "ออกจากระบบ"
  },
];

// Analytics Cards Data
export const cardsData = [
  {
    title: "Balance",
    color: {
      backGround: "linear-gradient(180deg, #bb67ff 0%, #c484f3 100%)",
      boxShadow: "0px 10px 20px 0px #e0c6f5",
    },
    barValue: 70,
    value: "25,970",
    png: "far fa-piggy-bank",
    series: [
      {
        name: "Balance",
        data: [31, 40, 28, 51, 42, 109, 100],
      },
    ],
  },
  {
    title: "Wallet",
    color: {
      backGround: "linear-gradient(180deg, #51c260 0%, #61c071 100%)",
      boxShadow: "0px 10px 20px 0px #c6f5d4",
    },
    barValue: 40,
    value: "9,370",
    png: "far fa-wallet",
    series: [
      {
        name: "Balance",
        data: [31, 40, 28, 51, 42, 109, 100],
      },
    ],
  },
  {
    title: "Expense",
    color: {
      backGround: "linear-gradient(180deg, #FF919D 0%, #FC929D 100%)",
      boxShadow: "0px 10px 20px 0px #FDC0C7",
    },
    barValue: 80,
    value: "14,270",
    png: "far fa-receipt",
    series: [
      {
        name: "Expense",
        data: [10, 100, 50, 70, 80, 30, 40],
      },
    ],
  },
  {
    title: "Income",
    color: {
      backGround:
        "linear-gradient(rgb(248, 212, 154) -146.42%, rgb(255 202 113) -46.42%)",
      boxShadow: "0px 10px 20px 0px #F9D59B",
    },
    barValue: 60,
    value: "4,270",
    png: "far fa-money-bill-wave",
    series: [
      {
        name: "Income",
        data: [10, 25, 15, 30, 12, 15, 20],
      },
    ],
  },
];

// Recent Update Card Data
export const UpdatesData = [
  {
    img: img1,
    name: "Andrew Thomas",
    noti: "has ordered Apple smart watch 2500mh battery.",
    time: "25 seconds ago",
  },
  {
    img: img2,
    name: "James Bond",
    noti: "has received Samsung gadget for charging battery.",
    time: "30 minutes ago",
  },
  {
    img: img3,
    name: "Iron Man",
    noti: "has ordered Apple smart watch, samsung Gear 2500mh battery.",
    time: "2 hours ago",
  },
];

export const StringVersionDiGiPurse = ()=>{
  return (
    <div className="text-sm font-bold">Pursify Version 1.0</div>
  )
}