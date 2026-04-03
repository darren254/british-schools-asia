#!/usr/bin/env python3
"""Generate school profile .astro pages from schools.json, matching the tanglin-trust-school.astro pattern exactly."""

import json
import os

BASE = "/home/user/workspace/british-schools-asia"

with open(f"{BASE}/src/data/schools.json") as f:
    schools = json.load(f)

# Currency conversion helpers per currency code
CURRENCY_INFO = {
    "SGD": {"rate": 0.7777, "label": "SGD", "name": "1 SGD = 0.7777 USD"},
    "HKD": {"rate": 0.1282, "label": "HKD", "name": "1 HKD = 0.1282 USD"},
    "THB": {"rate": 0.0291, "label": "THB", "name": "1 THB = 0.0291 USD"},
    "MYR": {"rate": 0.2326, "label": "MYR", "name": "1 MYR = 0.2326 USD"},
    "JPY": {"rate": 0.0067, "label": "JPY", "name": "1 JPY = 0.0067 USD"},
    "CNY": {"rate": 0.1380, "label": "CNY", "name": "1 CNY = 0.1380 USD"},
    "VND": {"rate": 0.0000392, "label": "VND", "name": "1 VND = 0.0000392 USD"},
    "IDR": {"rate": 0.0000610, "label": "IDR", "name": "1 IDR = 0.0000610 USD"},
}

# Skip tanglin-trust-school (already exists) and other Singapore schools already built
SKIP_SLUGS = {"tanglin-trust-school", "dulwich-college-singapore", "brighton-college-singapore", "nexus-international-school"}

for school in schools:
    slug = school["slug"]
    # Build all schools not already created (we know only tanglin exists, but let's build all non-SG + SG ones too)
    # Actually, only tanglin-trust-school.astro exists. We need pages for the other 3 SG schools + 19 non-SG = 22 total
    if slug == "tanglin-trust-school":
        continue  # Already exists
    
    country_slug = school["countrySlug"]
    city_slug = school["citySlug"]
    currency = school.get("feeCurrency", "USD")
    cur_info = CURRENCY_INFO.get(currency, {"rate": 1, "label": currency, "name": f"1 {currency}"})
    
    # Determine relative import path depth: /schools/{country}/{city}/{slug}.astro -> 4 levels deep
    import_prefix = "../../../../"
    
    # Generate the fee table section
    has_fees = bool(school.get("fees"))
    
    # Build fee conversion function name based on currency
    fee_fn = f"""
function formatFee(amount: number): string {{
  return amount.toLocaleString('en-US');
}}

function toUSD(local: number): string {{
  return Math.round(local * {cur_info['rate']}).toLocaleString('en-US');
}}"""

    # Fee disclaimer text
    fee_disclaimer = f"All fees in {cur_info['label']} per year. USD equivalent shown at {cur_info['name']}."
    
    # Build the page
    page = f"""---
import BaseLayout from '{import_prefix}layouts/BaseLayout.astro';
import Header from '{import_prefix}components/Header.astro';
import Footer from '{import_prefix}components/Footer.astro';
import SchoolCard from '{import_prefix}components/SchoolCard.astro';
import schools from '{import_prefix}data/schools.json';

const school = schools.find((s) => s.slug === '{slug}')!;
const relatedSchools = schools
  .filter((s) => s.citySlug === '{city_slug}' && s.slug !== school.slug)
  .sort((a, b) => a.cityRank - b.cityRank);
{fee_fn}
---
<BaseLayout
  title={{`${{school.name}} — Fees, Rankings & Review`}}
  description={{`${{school.name}} in ${{school.city}}: ${{school.feeSummaryUSD}}. Asia Rank #${{school.asiaRank}}. Full fee schedule and editorial review.`}}
>
  <Header slot="header" />

  <!-- HERO IMAGE -->
  <section class="relative w-full h-[40vh] min-h-[300px] overflow-hidden">
    <img
      src={{school.heroImage || '/images/{city_slug}-hero.jpg'}}
      alt={{school.name}}
      class="absolute inset-0 w-full h-full object-cover"
    />
    <div class="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
  </section>

  <!-- BREADCRUMBS -->
  <div class="bsa-container pt-6 pb-4">
    <nav class="font-body text-xs text-black/50" aria-label="Breadcrumb">
      <a href="/" class="hover:text-black">Home</a>
      <span class="mx-1">/</span>
      <a href="/countries/{country_slug}" class="hover:text-black">{school['country']}</a>
      <span class="mx-1">/</span>
      <a href="/cities/{city_slug}" class="hover:text-black">{school['city']}</a>
      <span class="mx-1">/</span>
      <span class="text-black">{{school.name}}</span>
    </nav>
  </div>

  <!-- SCHOOL HEADER -->
  <section class="bsa-container pb-10">
    <div class="flex flex-col md:flex-row md:items-start md:justify-between gap-6">
      <div>
        <p class="label text-black/50 mb-3">{{school.city}}, {{school.country}}</p>
        <h1 class="mb-4">{{school.name}}</h1>
        <p class="font-body text-black/60">{{school.feeSummaryUSD}}</p>
      </div>
      <div class="flex gap-4">
        <div class="border border-black px-5 py-3 text-center">
          <p class="label text-black/50 mb-1">Asia Rank</p>
          <p class="font-display text-3xl">#{{school.asiaRank}}</p>
        </div>
        <div class="border border-black px-5 py-3 text-center">
          <p class="label text-black/50 mb-1">City Rank</p>
          <p class="font-display text-3xl">#{{school.cityRank}}</p>
        </div>
      </div>
    </div>
  </section>

  <hr class="divider bsa-container" />

  <!-- QUICK FACTS -->
  <section class="section">
    <div class="bsa-container">
      <p class="label mb-6">Quick Facts</p>
      <div class="grid grid-cols-2 md:grid-cols-4 gap-y-6 gap-x-8">
        <div>
          <p class="label text-black/40 mb-1">Type</p>
          <p class="font-body text-sm">{{school.type}}</p>
        </div>
        <div>
          <p class="label text-black/40 mb-1">Ages</p>
          <p class="font-body text-sm">{{school.ageRange}}</p>
        </div>
        <div>
          <p class="label text-black/40 mb-1">Year Groups</p>
          <p class="font-body text-sm">{{school.yearRange}}</p>
        </div>
        <div>
          <p class="label text-black/40 mb-1">Founded</p>
          <p class="font-body text-sm">{{school.founded}}</p>
        </div>
        <div>
          <p class="label text-black/40 mb-1">Approx. Roll</p>
          <p class="font-body text-sm">{{school.roll ? school.roll.toLocaleString() : '—'}}</p>
        </div>
        <div>
          <p class="label text-black/40 mb-1">Curricula</p>
          <p class="font-body text-sm">{{school.curricula.join(', ')}}</p>
        </div>
        <div>
          <p class="label text-black/40 mb-1">Fees From</p>
          <p class="font-body text-sm">{{school.feeSummary}}</p>
        </div>
        <div>
          <p class="label text-black/40 mb-1">Website</p>
          <a href={{school.website}} target="_blank" rel="noopener noreferrer" class="font-body text-sm">{{school.website.replace('https://', '').replace('http://', '')}}</a>
        </div>
      </div>
    </div>
  </section>

  <hr class="divider bsa-container" />

  <!-- OVERVIEW -->
  <section class="section">
    <div class="bsa-container">
      <div class="max-w-2xl">
        <p class="label mb-4">Overview</p>
        <h2 class="mb-6">About {{school.name}}</h2>
        <p class="font-body text-black/70 leading-relaxed">{{school.overview}}</p>
      </div>
    </div>
  </section>

  <hr class="divider bsa-container" />

  <!-- EDITORIAL ASSESSMENT -->
  {{school.hasEditorial && school.editorial ? (
    <section class="section">
      <div class="bsa-container">
        <div class="max-w-2xl">
          <p class="label mb-4">Editorial Assessment</p>
          <h2 class="mb-6">Our assessment</h2>
          <p class="font-body text-black/70 leading-relaxed">{{school.editorial}}</p>
        </div>
      </div>
    </section>
    <hr class="divider bsa-container" />
  ) : (
    <section class="section">
      <div class="bsa-container">
        <div class="max-w-2xl">
          <p class="label mb-4">Editorial Assessment</p>
          <p class="font-body text-black/50 italic">Editorial review not yet published. Our team is still completing its assessment of this school.</p>
        </div>
      </div>
    </section>
    <hr class="divider bsa-container" />
  )}}

  <!-- FEE TABLE -->
  {{school.fees && school.fees.length > 0 && (
    <section class="section">
      <div class="bsa-container">
        <p class="label mb-4">Fees</p>
        <h2 class="mb-3">Fee schedule</h2>
        <p class="font-body text-black/50 text-sm mb-8">{fee_disclaimer}</p>

        <div class="overflow-x-auto">
          <table class="w-full text-left max-w-2xl">
            <thead>
              <tr class="border-b border-black">
                <th class="label py-3 pr-4">Year Group</th>
                <th class="label py-3 pr-4 text-right">Tuition ({cur_info['label']})</th>
                <th class="label py-3 pr-4 text-right hidden sm:table-cell">Building Fund</th>
                <th class="label py-3 text-right">Total ({cur_info['label']})</th>
                <th class="label py-3 text-right hidden md:table-cell">Total (USD)</th>
              </tr>
            </thead>
            <tbody>
              {{school.fees.map((fee) => (
                <tr class="border-b border-border">
                  <td class="py-3 pr-4 font-body text-sm">{{fee.year}}</td>
                  <td class="py-3 pr-4 font-body text-sm text-right">{{formatFee(fee.tuition)}}</td>
                  <td class="py-3 pr-4 font-body text-sm text-right hidden sm:table-cell">{{formatFee(fee.buildingFund)}}</td>
                  <td class="py-3 font-body text-sm text-right font-medium">{{formatFee(fee.total)}}</td>
                  <td class="py-3 font-body text-sm text-right hidden md:table-cell text-black/60">{{toUSD(fee.total)}}</td>
                </tr>
              ))}}
            </tbody>
          </table>
        </div>

        <p class="font-body text-xs text-black/40 mt-4 max-w-2xl">
          Fees are indicative and based on published schedules. Additional charges may apply for registration, examinations, and school trips. Contact the school directly for the latest fee schedule.
        </p>
      </div>
    </section>
    <hr class="divider bsa-container" />
  )}}

  <!-- ACADEMICS -->
  <section class="section">
    <div class="bsa-container">
      <div class="max-w-2xl">
        <p class="label mb-4">Academics</p>
        <h2 class="mb-6">Curriculum and pathways</h2>
        <p class="font-body text-black/70 mb-4">
          {{school.name}} follows the {{school.curricula.join(', ')}} pathways. The school delivers the English National Curriculum from Early Years through to the senior years.
        </p>
        <div class="mt-6">
          <p class="label text-black/40 mb-2">Exam Pathways</p>
          <p class="font-body text-sm">{{school.curricula.join(' · ')}}</p>
        </div>
      </div>
    </div>
  </section>

  <hr class="divider bsa-container" />

  <!-- CAMPUS & LOCATION -->
  {{school.campus && (
    <section class="section">
      <div class="bsa-container">
        <div class="max-w-2xl">
          <p class="label mb-4">Campus &amp; Location</p>
          <h2 class="mb-6">Where the school is</h2>
          <div class="mb-4">
            <p class="label text-black/40 mb-1">Address</p>
            <p class="font-body text-sm">{{school.campus.address}}</p>
          </div>
          <div class="mb-4">
            <p class="label text-black/40 mb-1">Area</p>
            <p class="font-body text-sm">{{school.campus.area}}</p>
          </div>
          <p class="font-body text-black/70">{{school.campus.context}}</p>
        </div>
      </div>
    </section>
    <hr class="divider bsa-container" />
  )}}

  <!-- WAITLIST NOTE -->
  {{school.waitlistNote && (
    <section class="section">
      <div class="bsa-container">
        <div class="max-w-2xl">
          <p class="label mb-4">Admissions Note</p>
          <p class="font-body text-black/70">{{school.waitlistNote}}</p>
        </div>
      </div>
    </section>
    <hr class="divider bsa-container" />
  )}}

  <!-- RELATED SCHOOLS -->
  <section class="section">
    <div class="bsa-container">
      <p class="label mb-4">Also in {{school.city}}</p>
      <h2 class="mb-10">Other British schools in {{school.city}}</h2>
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-10">
        {{relatedSchools.map((s) => (
          <SchoolCard
            name={{s.name}}
            slug={{s.slug}}
            city={{s.city}}
            citySlug={{s.citySlug}}
            countrySlug={{s.countrySlug}}
            feeSummary={{s.feeSummaryUSD}}
            asiaRank={{s.asiaRank}}
            heroImage={{s.heroImage}}
          />
        ))}}
      </div>
    </div>
  </section>

  <hr class="divider bsa-container" />

  <!-- SOURCES -->
  <section class="py-8">
    <div class="bsa-container">
      <div class="max-w-2xl">
        <p class="label text-black/40 mb-3">About this profile</p>
        <p class="font-body text-xs text-black/40 mb-2">
          Rankings are produced by our research team. Fees are verified against school schedules. Editorial reviews reflect our team's assessment.
        </p>
        <p class="font-body text-xs text-black/40">
          <a href="/methodology">Read full methodology</a>
          &nbsp;&middot;&nbsp;
          <a href={{school.website}} target="_blank" rel="noopener noreferrer">Visit school website</a>
        </p>
      </div>
    </div>
  </section>

  <Footer slot="footer" />
</BaseLayout>
"""

    # Create directory
    dir_path = f"{BASE}/src/pages/schools/{country_slug}/{city_slug}"
    os.makedirs(dir_path, exist_ok=True)
    
    file_path = f"{dir_path}/{slug}.astro"
    with open(file_path, "w") as f:
        f.write(page)
    
    print(f"Created: {file_path}")

print("\nDone! Generated all school profile pages.")
