import { money } from "./categories";
import type { CategoryEstimate } from "./calculations";
import type { CategoryKey, Personalisation } from "./types";

/*
 * Step-by-step guides for every audit category (Phase 2).
 * Each guide is rule-based content, so opening a task never calls the AI.
 *
 * Outside links: only official or independent services are used. Links were
 * chosen to be stable home pages; please click-check them before launch.
 */

export type GuideLink = {
  label: string;
  url: string;
  note?: string;
};

export type GuideStep = {
  title: string;
  body: string;
  checklist?: string[];
  script?: string;
  link?: GuideLink;
};

export type Guide = {
  key: CategoryKey;
  taskTitle: string;
  why: string;
  whatToDo: string;
  time: string;
  need: string[];
  steps: GuideStep[];
  help: GuideLink[];
  script?: string;
  compareLink?: GuideLink;
  outcomeQuestion: string;
  /** Short reassurance shown with the outcome step. */
  outcomeNote: string;
};

export const AU_STATES = [
  { value: "NSW", label: "New South Wales" },
  { value: "VIC", label: "Victoria" },
  { value: "QLD", label: "Queensland" },
  { value: "SA", label: "South Australia" },
  { value: "WA", label: "Western Australia" },
  { value: "TAS", label: "Tasmania" },
  { value: "ACT", label: "Australian Capital Territory" },
  { value: "NT", label: "Northern Territory" },
];

const ENERGY_MADE_EASY: GuideLink = {
  label: "Energy Made Easy (Australian Government)",
  url: "https://www.energymadeeasy.gov.au/",
  note: "Free, independent comparison for NSW, QLD, SA, TAS and the ACT.",
};

const VIC_ENERGY_COMPARE: GuideLink = {
  label: "Victorian Energy Compare (Victorian Government)",
  url: "https://compare.energy.vic.gov.au/",
  note: "Free, independent comparison for Victorian households.",
};

const MONEYSMART: GuideLink = {
  label: "Moneysmart (ASIC)",
  url: "https://moneysmart.gov.au/",
  note: "Free, independent money guidance from the Australian Government.",
};

const PRIVATE_HEALTH: GuideLink = {
  label: "privatehealth.gov.au (Australian Government)",
  url: "https://www.privatehealth.gov.au/",
  note: "Independent comparison of health insurance policies.",
};

const AFCA: GuideLink = {
  label: "Australian Financial Complaints Authority",
  url: "https://www.afca.org.au/",
  note: "Free help if you can't resolve an insurance dispute.",
};

const TIO: GuideLink = {
  label: "Telecommunications Industry Ombudsman",
  url: "https://www.tio.com.au/",
  note: "Free help if you can't resolve a phone or internet problem.",
};

export function energyCompareLink(state?: string | null): GuideLink | null {
  if (state === "VIC") return VIC_ENERGY_COMPARE;
  if (state && ["NSW", "QLD", "SA", "TAS", "ACT"].includes(state)) return ENERGY_MADE_EASY;
  return null;
}

type Ctx = {
  answer: string;
  estimate: CategoryEstimate;
  p: Personalisation;
};

function lc(s: string) {
  return s ? s.charAt(0).toLowerCase() + s.slice(1) : s;
}

export function getGuide(key: CategoryKey, ctx: Ctx): Guide {
  const { answer, estimate, p } = ctx;

  switch (key) {
    case "energy": {
      const state = p.energy?.state || null;
      const link = energyCompareLink(state);
      const noCompetition = state === "WA" || state === "NT";
      return {
        key,
        taskTitle: noCompetition ? "Check Your Energy Tariff" : "Check Your Electricity Plan",
        why:
          answer && !/within 6 months/i.test(answer)
            ? `You told us you last compared your energy plan: ${lc(answer)}. Plans and discounts change often, so it may be worth checking whether a better option is available.`
            : "Energy offers change often. A quick check makes sure you're not paying more than you need to.",
        whatToDo: "Find your latest energy bill and compare suitable plans.",
        time: "About 10–15 minutes to get started.",
        need: [
          "Your latest electricity (and gas) bill",
          "Your postcode",
          "Your usage in kWh, shown on your bill",
          "Your current retailer and plan name",
        ],
        steps: [
          {
            title: "Find your latest bill",
            body: "Download it from your retailer's app or email. A recent full bill is best because it shows your usage.",
          },
          {
            title: "Check your plan details",
            body: "Note your retailer, plan name, supply charge, usage rates and any discounts or contract end date.",
            checklist: ["Retailer and plan name", "Daily supply charge", "Usage rate (c/kWh)", "Discounts and when they end"],
          },
          noCompetition
            ? {
                title: "Check your tariff options",
                body: `In ${state}, most households can't switch retailer. Contact your retailer to check you're on the best tariff for your usage and receiving every concession or rebate you're eligible for.`,
              }
            : {
                title: "Open an official comparison service",
                body: link
                  ? "Enter your postcode and usage from your bill. Official services show all available plans, not just ones that pay commissions."
                  : "Use the official comparison service for your state: Victorian Energy Compare in Victoria, or Energy Made Easy in NSW, QLD, SA, TAS and the ACT. Add your state in “Make Your Savings Plan More Personal” and we'll show the right link.",
                link: link || undefined,
              },
          {
            title: "Compare the full plan, not just the headline",
            body: "Look at the estimated yearly cost for your usage, not an advertised percentage discount.",
            checklist: ["Estimated yearly cost", "Supply charge", "Usage rates", "Fees and exit fees", "Contract length"],
          },
          {
            title: "Ask your retailer or switch",
            body: "If you find a better option that suits you, ask your current retailer to match it, or switch. Switching doesn't cut your power.",
            script:
              "Hi, I've been comparing energy plans and found a lower estimated yearly cost for my usage. Before I decide whether to switch, can you check if there's a better plan you can move me to?",
          },
          {
            title: "Record what happened",
            body: "Mark the task as done. If your bill went down, record the old and new cost so you can see the result.",
          },
        ],
        help: link ? [link] : [ENERGY_MADE_EASY, VIC_ENERGY_COMPARE],
        script:
          "Hi, I've been comparing energy plans and found a lower estimated yearly cost for my usage. Before I decide whether to switch, can you check if there's a better plan you can move me to?",
        compareLink: noCompetition ? undefined : link || undefined,
        outcomeQuestion: "Did you find a better energy deal?",
        outcomeNote: "If you checked and your current plan is already good, that's a useful result too.",
      };
    }

    case "internet": {
      const pays = p.internet?.pays;
      const what = pays === "mobile" ? "mobile" : pays === "internet" ? "internet" : "internet and mobile";
      return {
        key,
        taskTitle: `Review Your ${what === "internet and mobile" ? "Internet & Mobile" : what === "mobile" ? "Mobile" : "Internet"} Bill`,
        why:
          answer && !/within 6 months/i.test(answer)
            ? `You told us you last compared your plan: ${lc(answer)}. Older plans can cost more than current offers for the same service.`
            : "Providers regularly release new plans, so it's worth checking you're still on a good deal.",
        whatToDo: `Check your current ${what} plan, compare a few options and ask for a better deal.`,
        time: "About 15 minutes to get started.",
        need: ["Your latest bill", "Your plan name, speed and data allowance", "Any contract or device payment end date"],
        steps: [
          {
            title: "Find your bill",
            body: "Check your monthly cost and the plan you're on, including speed (for internet) and data (for mobile).",
          },
          {
            title: "Compare plans",
            body: "Look at plans from your current provider and two or three others that offer the speed, data, service and coverage you need.",
            checklist: ["Total monthly cost", "Speed or data allowance", "Coverage where you live and work", "Contract length", "Setup or exit fees"],
          },
          {
            title: "Ask for a better deal",
            body: "Call or chat with your provider. Copy the script below if it helps.",
            script:
              "Hi, I've been reviewing my bill and comparing other plans. I'd like to see if you can offer me a better deal before I decide whether to switch.",
          },
          {
            title: "Make a decision",
            body: "Only switch if the new plan still meets your needs. A cheaper plan isn't a saving if it doesn't work for you.",
            checklist: ["Total cost", "Speed", "Data limits", "Connection needs", "Any extra fees"],
          },
          {
            title: "Record the outcome",
            body: "Mark the task as done and record your old and new monthly cost if it changed.",
          },
        ],
        help: [TIO],
        script:
          "Hi, I've been reviewing my bill and comparing other plans. I'd like to see if you can offer me a better deal before I decide whether to switch.",
        outcomeQuestion: "Did you find a better deal?",
        outcomeNote: "Keeping your plan because it suits you is a perfectly good outcome.",
      };
    }

    case "subscriptions": {
      const listed = p.subscriptions?.items?.filter((i) => i.considerCancelling).map((i) => i.name).filter(Boolean) || [];
      return {
        key,
        taskTitle: "Check Your Unused Subscriptions",
        why:
          listed.length > 0
            ? `You said you'd consider cancelling ${listed.slice(0, 3).join(", ")}${listed.length > 3 ? " and more" : ""}. Small monthly charges add up across a year.`
            : answer
              ? `You told us you pay for ${answer} subscriptions. Small monthly charges are easy to forget and add up across a year.`
              : "Small monthly charges are easy to forget and add up across a year.",
        whatToDo: "List your subscriptions, find the ones you don't use and cancel any you choose to stop.",
        time: "About 10 minutes to get started.",
        need: ["Your banking app or card statements from the last 2–3 months", "Your app store subscription list (Apple or Google)"],
        steps: [
          {
            title: "Make a list of your subscriptions",
            body: "Search your bank statements for repeat charges and check your phone's app store subscription list.",
            checklist: ["Streaming", "Music", "Apps and cloud storage", "Gym or fitness", "News and magazines", "Delivery memberships"],
          },
          {
            title: "Check what each one costs",
            body: "Write down the price and how often you're charged. Annual renewals are easy to miss.",
          },
          {
            title: "Find the ones you no longer use",
            body: "Ask: have I used this in the last month? Would I sign up again today at this price?",
          },
          {
            title: "Cancel any you choose to stop",
            body: "Cancel in the app or account settings, or contact the business. Keep the confirmation email.",
            script:
              "Hi, I'd like to cancel my subscription, effective at the end of the current billing period. Please confirm the cancellation in writing and that no further charges will be made.",
          },
          {
            title: "Record the cost removed",
            body: "Record the cost before and after. You can mark the task complete even if you decide to keep everything.",
          },
        ],
        help: [MONEYSMART],
        script:
          "Hi, I'd like to cancel my subscription, effective at the end of the current billing period. Please confirm the cancellation in writing and that no further charges will be made.",
        outcomeQuestion: "Did you reduce a cost?",
        outcomeNote: "There's no pressure to cancel services you value.",
      };
    }

    case "takeaway": {
      const spend = p.takeaway?.weeklySpend;
      const target = p.takeaway?.weeklyReduction;
      return {
        key,
        taskTitle: "Set Your Takeaway Target",
        why:
          spend
            ? `You told us you spend about ${money(spend)} a week on takeaway.${target ? ` Cutting ${money(target)} a week adds up to ${money(target * 52)} a year.` : ""}`
            : answer
              ? `You told us you order takeaway or delivery ${lc(answer)}. Delivery fees and menu mark-ups add up quickly.`
              : "Delivery fees and menu mark-ups add up quickly.",
        whatToDo: "Choose a realistic weekly takeaway budget and plan the nights you'd usually order.",
        time: "About 5–10 minutes to get started.",
        need: ["Your delivery app order history", "A rough idea of your busiest nights"],
        steps: [
          {
            title: "Check what you really spend",
            body: "Open your delivery apps and add up the last four weeks, including fees and tips. Divide by four for a weekly figure.",
          },
          {
            title: "Pick a realistic weekly target",
            body: "Choose an amount you could genuinely cut, not your whole spend. Small, steady changes last longer.",
          },
          {
            title: "Plan your usual takeaway nights",
            body: "Pick one or two easy meals for the nights you usually order, and keep the ingredients on hand.",
            checklist: ["Two quick backup meals", "Ingredients in the pantry or freezer", "Turn off delivery app notifications"],
          },
          {
            title: "Keep takeaway as a planned treat",
            body: "Order on purpose rather than by default. Picking up instead of delivery can also cut fees.",
          },
          {
            title: "Record what happened",
            body: "After a few weeks, record your old and new weekly spend to see the difference.",
          },
        ],
        help: [MONEYSMART],
        outcomeQuestion: "Did your takeaway spending go down?",
        outcomeNote: "Even a small weekly change is worth recording.",
      };
    }

    case "convenience": {
      const types = p.convenience?.reduceTypes || [];
      return {
        key,
        taskTitle: "Cut Back on Convenience Buys",
        why:
          types.length > 0
            ? `You want to reduce spending on ${types.slice(0, 3).join(", ").toLowerCase()}. Small daily purchases quietly add up.`
            : answer
              ? `You told us you buy coffee, drinks, snacks or quick lunches ${lc(answer)}. Small purchases quietly add up.`
              : "Small daily purchases quietly add up.",
        whatToDo: "Find the convenience buys you'd most like to reduce and set a simple weekly limit.",
        time: "About 5–10 minutes to get started.",
        need: ["Your banking app (last two weeks of transactions)"],
        steps: [
          {
            title: "Spot your common purchases",
            body: "Scroll through the last two weeks of transactions and mark coffees, drinks, snacks and quick lunches.",
          },
          {
            title: "Choose what to reduce",
            body: "Pick one or two you'd happily swap. Keep the ones you genuinely enjoy.",
            checklist: ["Coffee", "Drinks", "Snacks", "Quick lunches", "Petrol station or convenience store buys"],
          },
          {
            title: "Set a weekly limit",
            body: "Decide on a realistic weekly amount and make it easy: take a drink bottle or pack lunch two days a week.",
          },
          {
            title: "Record what happened",
            body: "After two or three weeks, record your old and new weekly spend.",
          },
        ],
        help: [MONEYSMART],
        outcomeQuestion: "Did your convenience spending go down?",
        outcomeNote: "Keeping the treats you value is fine. This is about the ones you don't miss.",
      };
    }

    case "unplanned": {
      return {
        key,
        taskTitle: "Create a Pause-Before-You-Buy Rule",
        why: answer
          ? `You told us you buy things you didn't plan to ${lc(answer)}. A simple rule before buying can stop the purchases you later regret.`
          : "A simple rule before buying can stop the purchases you later regret.",
        whatToDo: "Set one simple rule to pause before unplanned purchases.",
        time: "About 5 minutes to get started.",
        need: ["Nothing. Just a few minutes"],
        steps: [
          {
            title: "Pick your rule",
            body: "Choose one rule you'll actually use.",
            checklist: [
              "Wait 24 hours before buying anything over $50",
              "Add items to a wish list and review it weekly",
              "Remove saved cards from shopping sites",
              "Unsubscribe from sale emails",
            ],
          },
          {
            title: "Set a realistic monthly goal",
            body: "Choose an amount you'd like to cut from unplanned purchases each month.",
          },
          {
            title: "Make it easy to follow",
            body: "Turn off shopping app notifications and log out of stores you browse often.",
          },
          {
            title: "Record what happened",
            body: "After a month, record your old and new monthly spend on unplanned buys.",
          },
        ],
        help: [MONEYSMART],
        outcomeQuestion: "Did your unplanned spending go down?",
        outcomeNote: "Record what actually happened, even if the change was small.",
      };
    }

    case "insurance": {
      const renewal = p.insurance?.nextRenewal;
      const types = (p.insurance?.types || []).filter((t) => t !== "none");
      const hasHealth = types.includes("Health");
      return {
        key,
        taskTitle: "Prepare for Your Insurance Review",
        why:
          answer && !/within 6 months/i.test(answer)
            ? `You told us you last compared your insurance: ${lc(answer)}. Premiums often rise at renewal, so reviewing your cover can help you understand what you're paying for.`
            : "Premiums often change at renewal, so it's worth understanding what you're paying for.",
        whatToDo: renewal
          ? `Gather your policy details before your renewal on ${renewal} and compare like-for-like cover.`
          : "Gather your policy details and compare like-for-like cover before your next renewal.",
        time: "About 20–30 minutes to get started.",
        need: ["Your current policy documents or renewal notice", "Your Product Disclosure Statement (PDS)", "Your excess and sum insured"],
        steps: [
          {
            title: "Gather your policy details",
            body: "For each policy, note the premium, excess, sum insured, renewal date and what's covered.",
            checklist: ["Premium and how often you pay", "Excess", "Sum insured", "Renewal date", "Main inclusions and exclusions"],
          },
          {
            title: "Check your cover still fits",
            body: "Has anything changed, like your car, home contents or circumstances? Make sure you're not under-insured.",
          },
          {
            title: "Compare like-for-like quotes",
            body: hasHealth
              ? "Compare policies with the same level of cover. For health insurance, the Government's privatehealth.gov.au compares policies independently."
              : "Get two or three quotes for the same level of cover, excess and sum insured. A lower price with less cover isn't a saving.",
            link: hasHealth ? PRIVATE_HEALTH : undefined,
          },
          {
            title: "Ask your current insurer",
            body: "Insurers can sometimes review your premium, especially at renewal.",
            script:
              "Hi, my policy is coming up for renewal and I've been comparing like-for-like cover. Can you review my premium and let me know if there are any discounts I'm eligible for?",
          },
          {
            title: "Record what happened",
            body: "Mark the task done. If your premium went down for the same cover, record the old and new cost.",
          },
        ],
        help: [MONEYSMART, ...(hasHealth ? [PRIVATE_HEALTH] : []), AFCA],
        script:
          "Hi, my policy is coming up for renewal and I've been comparing like-for-like cover. Can you review my premium and let me know if there are any discounts I'm eligible for?",
        outcomeQuestion: "Did your premium go down for the same cover?",
        outcomeNote:
          "This is general information only, not advice about any insurance product. Never cancel or reduce cover without checking what you'd lose. Consider the PDS and get professional advice if you're unsure.",
      };
    }
  }
}
