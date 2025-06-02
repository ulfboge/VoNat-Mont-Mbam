#!/usr/bin/env python
"""
Markdown to PDF Converter Script
This script converts Markdown files to PDF format with proper styling and image handling.
"""

import os
import sys
import subprocess
import argparse
from pathlib import Path

def check_requirements():
    """Check if required packages are installed."""
    try:
        import pip
        return True
    except ImportError:
        print("Error: pip is not installed. Please install pip first.")
        return False

def install_requirements():
    """Install required packages."""
    packages = ["markdown", "weasyprint", "markdown-pdf"]
    for package in packages:
        try:
            subprocess.check_call([sys.executable, "-m", "pip", "install", package])
            print(f"Successfully installed {package}")
        except subprocess.CalledProcessError:
            print(f"Failed to install {package}")
            return False
    return True

def convert_markdown_to_pdf(input_file, output_file=None):
    """Convert Markdown file to PDF."""
    if not os.path.exists(input_file):
        print(f"Error: Input file '{input_file}' not found.")
        return False
    
    if output_file is None:
        output_file = os.path.splitext(input_file)[0] + ".pdf"
    
    try:
        # Try using markdown-pdf if available
        subprocess.check_call([sys.executable, "-m", "markdown_pdf", input_file, "-o", output_file])
        print(f"Successfully converted {input_file} to {output_file}")
        return True
    except (subprocess.CalledProcessError, ImportError):
        print("Falling back to alternative conversion method...")
        try:
            # Alternative method using markdown and weasyprint
            from markdown import markdown
            from weasyprint import HTML
            
            with open(input_file, 'r', encoding='utf-8') as f:
                html = markdown(f.read(), extensions=['tables', 'fenced_code'])
            
            # Add CSS for better styling
            html = f"""
            <!DOCTYPE html>
            <html>
            <head>
                <meta charset="utf-8">
                <style>
                    body {{ font-family: Arial, sans-serif; margin: 40px; }}
                    img {{ max-width: 100%; }}
                    table {{ border-collapse: collapse; width: 100%; }}
                    th, td {{ border: 1px solid #ddd; padding: 8px; }}
                    th {{ background-color: #f2f2f2; }}
                </style>
            </head>
            <body>
                {html}
            </body>
            </html>
            """
            
            HTML(string=html).write_pdf(output_file)
            print(f"Successfully converted {input_file} to {output_file}")
            return True
        except Exception as e:
            print(f"Error during conversion: {e}")
            return False

def main():
    parser = argparse.ArgumentParser(description='Convert Markdown files to PDF.')
    parser.add_argument('input', help='Input Markdown file')
    parser.add_argument('-o', '--output', help='Output PDF file')
    args = parser.parse_args()
    
    if not check_requirements():
        print("Installing required packages...")
        if not install_requirements():
            print("Failed to install required packages. Please install them manually.")
            return
    
    convert_markdown_to_pdf(args.input, args.output)

if __name__ == "__main__":
    main()
