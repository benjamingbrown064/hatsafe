'use client';

import { motion } from 'framer-motion';
import { CheckCircle, Upload, Bell, BarChart3, Shield, Search, FileText, Users } from 'lucide-react';
import Link from 'next/link';

// Animation variants
const fadeInUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 }
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

export default function MarketingHome() {
  return (
    <div className="min-h-screen bg-white">
      {/* Sticky Navigation */}
      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-sm border-b border-gray-100"
      >
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Shield className="w-8 h-8 text-emerald-600" />
            <span className="text-2xl font-bold text-gray-900">HatSafe</span>
          </div>
          <div className="hidden md:flex items-center gap-8">
            <Link href="#features" className="text-gray-600 hover:text-gray-900 transition">Features</Link>
            <Link href="#pricing" className="text-gray-600 hover:text-gray-900 transition">Pricing</Link>
            <Link href="/login" className="text-gray-600 hover:text-gray-900 transition">Login</Link>
            <Link href="#demo" className="px-6 py-2.5 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition font-medium">
              Book a demo
            </Link>
          </div>
        </div>
      </motion.nav>

      {/* Hero Section */}
      <section className="pt-40 pb-32 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <motion.div
              initial="hidden"
              animate="visible"
              variants={staggerContainer}
              className="space-y-8"
            >
              <motion.h1
                variants={fadeInUp}
                className="text-6xl lg:text-7xl font-bold text-gray-900 leading-tight"
              >
                Stop chasing certificates in spreadsheets and inboxes
              </motion.h1>
              <motion.p
                variants={fadeInUp}
                className="text-xl text-gray-600 max-w-2xl leading-relaxed"
              >
                HatSafe gives construction and trade businesses one simple place to store, track, and manage compliance documents — with automated expiry alerts and AI-assisted document processing.
              </motion.p>
              <motion.div
                variants={fadeInUp}
                className="flex flex-col sm:flex-row gap-4"
              >
                <Link href="#demo" className="px-8 py-4 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition font-medium text-lg">
                  Book a demo
                </Link>
                <Link href="#how-it-works" className="px-8 py-4 border-2 border-gray-200 text-gray-900 rounded-lg hover:border-gray-300 transition font-medium text-lg">
                  See how it works
                </Link>
              </motion.div>
              <motion.div
                variants={fadeInUp}
                className="pt-8 space-y-3"
              >
                {[
                  'Track employee, contractor, and supplier compliance in one place',
                  'Get ahead of expired certificates before they become a problem',
                  'Cut admin time spent chasing paperwork manually'
                ].map((point, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <CheckCircle className="w-6 h-6 text-emerald-600 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-700 text-lg">{point}</span>
                  </div>
                ))}
              </motion.div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="relative"
            >
              <div className="aspect-[4/3] rounded-2xl bg-gradient-to-br from-emerald-50 to-gray-50 border border-gray-200 shadow-2xl overflow-hidden">
                <div className="absolute inset-0 flex items-center justify-center">
                  <Shield className="w-32 h-32 text-emerald-200" />
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Problem Section */}
      <section className="py-32 px-6 bg-gray-50">
        <div className="max-w-4xl mx-auto text-center space-y-6">
          <motion.h2
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeInUp}
            className="text-5xl font-bold text-gray-900"
          >
            Compliance gets messy fast when everything lives in different places
          </motion.h2>
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeInUp}
            className="space-y-6 text-lg text-gray-600 leading-relaxed"
          >
            <p>
              Most teams do not lose control of compliance because they do not care.
            </p>
            <p>
              They lose control because certificates, licences, and training records end up spread across spreadsheets, inboxes, shared drives, and filing systems.
            </p>
            <p className="font-medium text-gray-900">That creates the same problems over and over:</p>
          </motion.div>
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerContainer}
            className="grid sm:grid-cols-2 gap-6 pt-8 text-left"
          >
            {[
              'expired documents slip through',
              'teams waste time chasing updates',
              'managers cannot see what is missing',
              'audits become stressful and reactive'
            ].map((problem, i) => (
              <motion.div
                key={i}
                variants={fadeInUp}
                className="p-6 bg-white rounded-xl border border-gray-200"
              >
                <p className="text-gray-700 text-lg">{problem}</p>
              </motion.div>
            ))}
          </motion.div>
          <motion.p
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeInUp}
            className="text-xl font-medium text-gray-900 pt-8"
          >
            HatSafe fixes that by giving you one operational system for compliance documents.
          </motion.p>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="py-32 px-6">
        <div className="max-w-6xl mx-auto">
          <motion.h2
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeInUp}
            className="text-5xl font-bold text-gray-900 text-center mb-20"
          >
            How HatSafe works
          </motion.h2>
          <div className="space-y-32">
            {[
              {
                step: '1',
                title: 'Upload documents',
                description: 'Add certificates, licences, training records, insurance documents, and compliance files in one place.',
                icon: Upload
              },
              {
                step: '2',
                title: 'Organise automatically',
                description: 'HatSafe helps pull out the important details, including certificate type, holder, and expiry date.',
                icon: FileText
              },
              {
                step: '3',
                title: 'Track what matters',
                description: 'See upcoming renewals, expired records, and missing documents across your workforce and subcontractors.',
                icon: BarChart3
              },
              {
                step: '4',
                title: 'Take action early',
                description: 'Use alerts and reporting to fix issues before they become operational or compliance problems.',
                icon: Bell
              }
            ].map((step, i) => {
              const Icon = step.icon;
              return (
                <motion.div
                  key={i}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true }}
                  variants={fadeInUp}
                  className={`grid md:grid-cols-2 gap-16 items-center ${i % 2 === 1 ? 'md:flex-row-reverse' : ''}`}
                >
                  <div className={i % 2 === 1 ? 'md:order-2' : ''}>
                    <div className="inline-block px-4 py-2 bg-emerald-100 text-emerald-700 rounded-full text-sm font-medium mb-6">
                      Step {step.step}
                    </div>
                    <h3 className="text-4xl font-bold text-gray-900 mb-6">{step.title}</h3>
                    <p className="text-xl text-gray-600 leading-relaxed">{step.description}</p>
                  </div>
                  <div className={i % 2 === 1 ? 'md:order-1' : ''}>
                    <div className="aspect-[4/3] rounded-2xl bg-gradient-to-br from-emerald-50 to-gray-50 border border-gray-200 flex items-center justify-center">
                      <Icon className="w-24 h-24 text-emerald-400" />
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Benefits Bento Grid */}
      <section id="features" className="py-32 px-6 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <motion.h2
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeInUp}
            className="text-5xl font-bold text-gray-900 text-center mb-20"
          >
            Built for real compliance admin, not generic document storage
          </motion.h2>
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerContainer}
            className="grid md:grid-cols-2 gap-6"
          >
            {[
              {
                title: 'One source of truth',
                description: 'Keep employee, contractor, and supplier documents in one searchable place.',
                icon: Shield
              },
              {
                title: 'Expiry visibility',
                description: 'Know what is due to expire before it catches your team out.',
                icon: Bell
              },
              {
                title: 'Less admin time',
                description: 'Reduce manual chasing and repetitive spreadsheet work.',
                icon: CheckCircle
              },
              {
                title: 'Better operational control',
                description: 'Give managers a live view of what is compliant, what is missing, and what needs attention.',
                icon: BarChart3
              }
            ].map((benefit, i) => {
              const Icon = benefit.icon;
              return (
                <motion.div
                  key={i}
                  variants={fadeInUp}
                  className="p-8 bg-white rounded-2xl border border-gray-200 hover:shadow-lg transition"
                >
                  <Icon className="w-12 h-12 text-emerald-600 mb-6" />
                  <h3 className="text-2xl font-bold text-gray-900 mb-4">{benefit.title}</h3>
                  <p className="text-lg text-gray-600 leading-relaxed">{benefit.description}</p>
                </motion.div>
              );
            })}
          </motion.div>
        </div>
      </section>

      {/* Social Proof */}
      <section className="py-32 px-6">
        <div className="max-w-5xl mx-auto">
          <motion.h2
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeInUp}
            className="text-5xl font-bold text-gray-900 text-center mb-20"
          >
            Made for businesses that cannot afford compliance gaps
          </motion.h2>
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerContainer}
            className="space-y-8"
          >
            {[
              'HatSafe gave us one clear view of certification status instead of three different spreadsheets.',
              'We stopped reacting to expired documents and started dealing with issues before they became a problem.',
              'It cut the admin burden massively and made audit prep far easier.'
            ].map((quote, i) => (
              <motion.blockquote
                key={i}
                variants={fadeInUp}
                className="p-8 bg-gray-50 rounded-2xl border border-gray-200"
              >
                <p className="text-2xl text-gray-700 leading-relaxed italic">"{quote}"</p>
              </motion.blockquote>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Pricing Teaser */}
      <section id="pricing" className="py-32 px-6 bg-gray-50">
        <div className="max-w-4xl mx-auto text-center space-y-8">
          <motion.h2
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeInUp}
            className="text-5xl font-bold text-gray-900"
          >
            Simple pricing that matches growing teams
          </motion.h2>
          <motion.p
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeInUp}
            className="text-xl text-gray-600 leading-relaxed"
          >
            HatSafe is designed for practical adoption, not drawn-out enterprise sales cycles.
          </motion.p>
          <motion.p
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeInUp}
            className="text-2xl text-gray-900 font-medium"
          >
            Plans start from <span className="text-emerald-600 font-bold">£49/month</span>, with options for growing teams that need more visibility, reporting, and control.
          </motion.p>
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeInUp}
          >
            <Link href="#demo" className="inline-block px-8 py-4 border-2 border-gray-900 text-gray-900 rounded-lg hover:bg-gray-900 hover:text-white transition font-medium text-lg">
              View pricing
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Final CTA */}
      <section id="demo" className="py-32 px-6">
        <div className="max-w-4xl mx-auto text-center space-y-8">
          <motion.h2
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeInUp}
            className="text-5xl font-bold text-gray-900"
          >
            Get control of compliance before it becomes a fire drill
          </motion.h2>
          <motion.p
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeInUp}
            className="text-xl text-gray-600 leading-relaxed max-w-3xl mx-auto"
          >
            If your team is still managing certificates across spreadsheets, inboxes, and folders, HatSafe gives you a cleaner way to stay on top of it.
          </motion.p>
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeInUp}
            className="flex flex-col sm:flex-row gap-4 justify-center pt-8"
          >
            <Link href="/signup" className="px-8 py-4 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition font-medium text-lg">
              Book a demo
            </Link>
            <Link href="mailto:hello@hatsafe.com" className="px-8 py-4 border-2 border-gray-200 text-gray-900 rounded-lg hover:border-gray-300 transition font-medium text-lg">
              Talk through your setup
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-200 py-16 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-4 gap-12 mb-12">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <Shield className="w-8 h-8 text-emerald-600" />
                <span className="text-xl font-bold text-gray-900">HatSafe</span>
              </div>
              <p className="text-gray-600">
                AI-powered certificate and compliance management for construction and trade businesses.
              </p>
            </div>
            <div>
              <h4 className="font-bold text-gray-900 mb-4">Product</h4>
              <ul className="space-y-3">
                <li><Link href="#features" className="text-gray-600 hover:text-gray-900">Features</Link></li>
                <li><Link href="#pricing" className="text-gray-600 hover:text-gray-900">Pricing</Link></li>
                <li><Link href="/signup" className="text-gray-600 hover:text-gray-900">Sign up</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold text-gray-900 mb-4">Company</h4>
              <ul className="space-y-3">
                <li><Link href="/about" className="text-gray-600 hover:text-gray-900">About</Link></li>
                <li><Link href="/contact" className="text-gray-600 hover:text-gray-900">Contact</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold text-gray-900 mb-4">Legal</h4>
              <ul className="space-y-3">
                <li><Link href="/privacy" className="text-gray-600 hover:text-gray-900">Privacy</Link></li>
                <li><Link href="/terms" className="text-gray-600 hover:text-gray-900">Terms</Link></li>
              </ul>
            </div>
          </div>
          <div className="pt-8 border-t border-gray-200 text-center text-gray-600">
            <p>&copy; 2026 HatSafe. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
