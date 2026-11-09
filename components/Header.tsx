"use client"; 

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { ShieldCheck, Menu, X, Mail, Phone } from "lucide-react";
import {
 Circle
} from "lucide-react";
export default function Header({ simple = false }: { simple?: boolean }) {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => setIsOpen(!isOpen);

  return (
    <header className="topbar" style={{ position: "relative" }}>
      <div
        className="container"
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          width: "100%",
        }}
      >
        {/* Brand Logo */}
        <Link href="/" className="logo reveal-left">
          <Image
            src="/logo.png"
            alt="SpendShift"
            width={200}
            height={60}
            priority
          />
        </Link>

        {simple ? (
          <span
            className="mini"
            style={{
              display: "flex",
              gap: 6,
              alignItems: "center",
            }}
          >
            <ShieldCheck size={16} color="#059625" />
            100% Secure & Private
          </span>
        ) : (
          <>
            {/* Desktop Navigation */}
            <nav className="nav desktop-only">
              <a href="/how-it-works">How it Works</a>
              <a href="/whats-included">What’s Included</a>
              <a href="/why-spendshift">Why SpendShift</a>
              <a href="/pricing">Pricing</a>
              <a href="/#faq">FAQ</a>
            </nav>

            <Link className="btn desktop-only reveal-right" href="/audit">
              Start Your Free Audit
            </Link>

            {/* Hamburger Button */}
            <button 
              className="hamburger-btn" 
              onClick={toggleMenu}
              style={{
                background: "none",
                border: "none",
                cursor: "pointer",
                zIndex: 110,
              }}
            >
              {isOpen ? <X size={28} /> : <Menu size={28} />}
            </button>

            {/* Side Panel Drawer */}
            <div 
              className={`side-panel ${isOpen ? "open" : ""}`}
              style={{
                position: "fixed",
                top: 0,
                right: isOpen ? 0 : "-100%",
                width: "300px",
                height: "100vh",
                backgroundColor: "#fff",
                boxShadow: "-2px 0 10px rgba(0,0,0,0.1)",
                transition: "right 0.3s ease-in-out",
                zIndex: 100,
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between", 
                padding: "80px 30px 40px 30px", 
              }}
            >
              {/* Top Links Block */}
              <div className="reveal-up" style={{ display: "flex", flexDirection: "column", gap: "30px" }}>
                <nav style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
                  <a href="/how-it-works" onClick={toggleMenu}><Circle size={12} color="#059625" /> How it Works</a>
                  <a href="/whats-included" onClick={toggleMenu}><Circle size={12} color="#059625" /> What’s Included</a>
                  <a href="/why-spendshift" onClick={toggleMenu}><Circle size={12} color="#059625" /> Why SpendShift</a>
                  <a href="/pricing" onClick={toggleMenu}><Circle size={12} color="#059625" /> Pricing</a>
                  <a href="/#faq" onClick={toggleMenu}><Circle size={12} color="#059625" /> FAQ</a>
                </nav>
                
                <Link className="btn" href="/audit" onClick={toggleMenu} style={{ textAlign: "center" }}>
                  Start Your Free Audit
                </Link>
              </div>

              {/* Bottom Contact Details Block */}
              <div 
                className="side-panel-footer reveal-up"
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "14px",
                  borderTop: "1px solid #eee",
                  paddingTop: "20px"
                }}
              >
                <a 
                  href="mailto:info@spendshift.com.au" 
                  style={{ 
                    display: "flex", 
                    alignItems: "center", 
                    gap: "10px", 
                    fontSize: "14px",
                    color: "#555" 
                  }}
                >
                  <Mail size={16} className="contact-icon" />
                  info@spendshift.com.au
                </a>
                
              </div>
            </div>

            {/* Backdrop Overlay */}
            {isOpen && (
              <div 
                onClick={toggleMenu}
                style={{
                  position: "fixed",
                  top: 0,
                  left: 0,
                  width: "100vw",
                  height: "100vh",
                  backgroundColor: "rgba(0,0,0,0.4)",
                  zIndex: 90
                }}
              />
            )}
          </>
        )}
      </div>
    </header>
  );
}
