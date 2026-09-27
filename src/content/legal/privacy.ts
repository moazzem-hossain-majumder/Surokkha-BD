export interface LegalSection {
  heading: { en: string; bn: string };
  body: { en: string; bn: string };
}

// DRAFT CONTENT -- NOT LEGAL ADVICE. See docs/rules.md and P6-6 in
// docs/phases.md: this describes what the app ACTUALLY does with data
// (grounded in the real schema and code, not generic boilerplate), but it
// has not been reviewed by a lawyer. Bangladesh passed the Personal Data
// Protection Act, 2026 (following the Personal Data Protection Ordinance,
// 2025) -- a real, current, and still-new law that a real deployment of
// this project should be reviewed against by counsel familiar with it
// before handling real users' data at any scale beyond a small pilot.
export const PRIVACY_LAST_UPDATED = "2026-09-27";

export const PRIVACY_SECTIONS: LegalSection[] = [
  {
    heading: { en: "What this page is", bn: "এই পাতাটি কী" },
    body: {
      en: "This is a draft privacy policy written to match what Surokkha BD actually collects and stores today. It has NOT been reviewed by a lawyer and is not a substitute for one -- especially given Bangladesh's Personal Data Protection Act, 2026, a new law that applies to anyone processing the personal data of people in Bangladesh. Before using this project beyond a small test pilot, have it reviewed by counsel familiar with that law.",
      bn: "এটি সুরক্ষা বিডি আজ প্রকৃতপক্ষে যা সংগ্রহ ও সংরক্ষণ করে তার সাথে মিল রেখে লেখা একটি খসড়া গোপনীয়তা নীতি। এটি কোনো আইনজীবী দ্বারা পর্যালোচিত হয়নি এবং তার বিকল্প নয় -- বিশেষত বাংলাদেশের পার্সোনাল ডেটা প্রোটেকশন অ্যাক্ট, ২০২৬ বিবেচনায়, যা বাংলাদেশের মানুষের ব্যক্তিগত তথ্য প্রক্রিয়াকরণকারী যেকোনো পক্ষের ক্ষেত্রে প্রযোজ্য একটি নতুন আইন। একটি ছোট পরীক্ষামূলক পাইলটের বাইরে এই প্রকল্প ব্যবহারের আগে, এই আইনে অভিজ্ঞ একজন আইনজীবী দিয়ে এটি পর্যালোচনা করান।",
    },
  },
  {
    heading: { en: "What we collect", bn: "আমরা যা সংগ্রহ করি" },
    body: {
      en: "An account (email address, via Supabase Auth) if you sign up. A display name and district, if you add them. Community reports you submit (description, an optional photo, a map location, and a hashed version of your IP address used only to limit how many reports one connection can submit per hour -- we do not store or use the raw IP for anything else). Relief pledges and volunteer applications you make, linked to your account. Ferry help requests, which can be submitted anonymously. We do not use analytics or advertising trackers of any kind.",
      bn: "আপনি সাইন আপ করলে একটি অ্যাকাউন্ট (সুপাবেস অথ-এর মাধ্যমে ইমেইল ঠিকানা)। আপনি যোগ করলে একটি প্রদর্শন নাম ও জেলা। আপনার জমা দেওয়া কমিউনিটি রিপোর্ট (বিবরণ, ঐচ্ছিক ছবি, একটি মানচিত্র অবস্থান, এবং আপনার আইপি ঠিকানার একটি হ্যাশ সংস্করণ যা শুধু এক ঘণ্টায় একটি সংযোগ থেকে কতগুলো রিপোর্ট জমা দেওয়া যাবে তা সীমিত করতে ব্যবহৃত হয় -- আমরা কাঁচা আইপি অন্য কোনো কাজে সংরক্ষণ বা ব্যবহার করি না)। আপনার করা ত্রাণ প্রতিশ্রুতি ও স্বেচ্ছাসেবক আবেদন, যা আপনার অ্যাকাউন্টের সাথে যুক্ত। ফেরি সহায়তা অনুরোধ, যা বেনামেও জমা দেওয়া যায়। আমরা কোনো ধরনের অ্যানালিটিক্স বা বিজ্ঞাপন ট্র্যাকার ব্যবহার করি না।",
    },
  },
  {
    heading: { en: "How it's used", bn: "এটি কীভাবে ব্যবহৃত হয়" },
    body: {
      en: "To run the features you use: showing your reports to coordinators for verification, matching your pledges to relief needs, sending you email notifications about things you're directly involved in (via Resend), and letting coordinators manage alerts, shelters, and tasks. We do not sell data, and we do not share it with anyone outside the coordinators and admins who need it to run the platform.",
      bn: "আপনি যে ফিচারগুলো ব্যবহার করেন তা চালাতে: যাচাইয়ের জন্য সমন্বয়কারীদের কাছে আপনার রিপোর্ট দেখানো, আপনার প্রতিশ্রুতিকে ত্রাণ চাহিদার সাথে মেলানো, আপনি সরাসরি জড়িত এমন বিষয়ে ইমেইল বিজ্ঞপ্তি পাঠানো (Resend-এর মাধ্যমে), এবং সমন্বয়কারীদের সতর্কতা, আশ্রয়কেন্দ্র ও কাজ পরিচালনা করতে দেওয়া। আমরা ডেটা বিক্রি করি না, এবং প্ল্যাটফর্ম চালাতে যাদের প্রয়োজন এমন সমন্বয়কারী ও অ্যাডমিন ছাড়া অন্য কারও সাথে তা শেয়ার করি না।",
    },
  },
  {
    heading: { en: "Where it's stored", bn: "এটি কোথায় সংরক্ষিত হয়" },
    body: {
      en: "In a Supabase project (PostgreSQL database, file storage for report photos). Which region that project lives in is a deployment choice, not something this codebase fixes -- if you're reviewing this for a real pilot, confirm the project's region and whether that satisfies any data-residency expectations for your users.",
      bn: "একটি সুপাবেস প্রজেক্টে (পোস্টগ্রেএসকিউএল ডেটাবেস, রিপোর্টের ছবির জন্য ফাইল স্টোরেজ)। সেই প্রজেক্ট কোন অঞ্চলে অবস্থিত তা একটি স্থাপনার সিদ্ধান্ত, এই কোডবেস তা নির্ধারণ করে না -- বাস্তব পাইলটের জন্য এটি পর্যালোচনা করলে, প্রজেক্টের অঞ্চল নিশ্চিত করুন এবং তা আপনার ব্যবহারকারীদের জন্য কোনো ডেটা-অবস্থান সংক্রান্ত প্রত্যাশা পূরণ করে কিনা তা যাচাই করুন।",
    },
  },
  {
    heading: { en: "Your choices", bn: "আপনার সিদ্ধান্ত" },
    body: {
      en: "You can view your account details and delete your account at any time from the Account page. Deleting your account removes your login and profile immediately. Content you posted (an alert, a report, a pledge) is not deleted with it -- it's kept for the public record and for other people who may be relying on it, but is no longer linked to your name or account. If you want something removed entirely rather than just detached, contact a coordinator.",
      bn: "আপনি যেকোনো সময় অ্যাকাউন্ট পাতা থেকে আপনার অ্যাকাউন্টের তথ্য দেখতে ও অ্যাকাউন্ট মুছে ফেলতে পারেন। অ্যাকাউন্ট মুছে ফেললে আপনার লগইন ও প্রোফাইল সাথে সাথে সরে যায়। আপনার পোস্ট করা কনটেন্ট (একটি সতর্কতা, রিপোর্ট, প্রতিশ্রুতি) এর সাথে মুছে যায় না -- এটি জনসাধারণের রেকর্ড এবং যারা এর উপর নির্ভর করতে পারেন তাদের জন্য রাখা হয়, তবে আর আপনার নাম বা অ্যাকাউন্টের সাথে যুক্ত থাকে না। সম্পূর্ণ অপসারণ চাইলে, একজন সমন্বয়কারীর সাথে যোগাযোগ করুন।",
    },
  },
  {
    heading: { en: "Local-only data", bn: "শুধু স্থানীয় ডেটা" },
    body: {
      en: "Quiz completions and game scores shown on the Progress page are stored only in your browser's local storage. They are never sent to a server and are lost if you clear your browser's site data or switch devices.",
      bn: "অগ্রগতি পাতায় দেখানো কুইজ সম্পন্ন হওয়া ও গেমের স্কোর শুধুমাত্র আপনার ব্রাউজারের লোকাল স্টোরেজে সংরক্ষিত থাকে। এগুলো কখনো সার্ভারে পাঠানো হয় না এবং আপনি ব্রাউজারের সাইট ডেটা মুছে ফেললে বা ডিভাইস পরিবর্তন করলে হারিয়ে যায়।",
    },
  },
  {
    heading: { en: "Contact", bn: "যোগাযোগ" },
    body: {
      en: "This project does not yet have a registered organization or a designated privacy contact -- that should be filled in here before any real pilot, along with a real process for handling data-subject requests under the Personal Data Protection Act, 2026.",
      bn: "এই প্রকল্পের এখনো কোনো নিবন্ধিত সংস্থা বা নির্দিষ্ট গোপনীয়তা যোগাযোগ নেই -- যেকোনো বাস্তব পাইলটের আগে এখানে তা যোগ করা উচিত, সাথে পার্সোনাল ডেটা প্রোটেকশন অ্যাক্ট, ২০২৬-এর অধীনে ডেটা-সাবজেক্ট অনুরোধ পরিচালনার একটি বাস্তব প্রক্রিয়াও।",
    },
  },
];
