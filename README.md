<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Goorac Learn</title>
    <style>
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Playfair+Display:wght@700&display=swap');
        
        :root {
            --primary-green: #22c55e;
            --dark-bg: #0a0a0a;
            --text-light: #f4f4f5;
        }
        
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        
        body {
            font-family: 'Inter', system_ui, sans-serif;
            background-color: var(--dark-bg);
            color: var(--text-light);
            line-height: 1.6;
            padding: 40px 20px;
        }
        
        .container {
            max-width: 1000px;
            margin: 0 auto;
        }
        
        header {
            text-align: center;
            margin-bottom: 60px;
        }
        
        .logo-container {
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 16px;
            margin-bottom: 24px;
        }
        
        .logo-text {
            font-family: 'Playfair Display', serif;
            font-size: 4.5rem;
            font-weight: 700;
            letter-spacing: -2px;
            line-height: 1;
        }
        
        .goorac {
            color: white;
        }
        
        .learn {
            color: var(--primary-green);
        }
        
        .tagline {
            font-size: 1.35rem;
            color: #a1a1aa;
            margin-top: 12px;
            font-weight: 500;
        }
        
        .hero {
            background: linear-gradient(135deg, #111 0%, #1a1a1a 100%);
            border-radius: 20px;
            padding: 80px 60px;
            margin-bottom: 60px;
            border: 1px solid #27272a;
            text-align: center;
        }
        
        h1 {
            font-size: 3.2rem;
            margin-bottom: 24px;
            font-weight: 700;
        }
        
        h2 {
            font-size: 1.8rem;
            margin: 48px 0 20px;
            color: white;
            position: relative;
            padding-bottom: 12px;
        }
        
        h2::after {
            content: '';
            position: absolute;
            bottom: 0;
            left: 0;
            width: 60px;
            height: 3px;
            background: var(--primary-green);
            border-radius: 3px;
        }
        
        p {
            font-size: 1.1rem;
            color: #d4d4d8;
            max-width: 780px;
            margin: 0 auto 28px;
        }
        
        .section {
            margin-bottom: 60px;
        }
        
        .policy-card {
            background: #18181b;
            border: 1px solid #3f3f46;
            border-radius: 16px;
            padding: 32px;
            margin-bottom: 32px;
        }
        
        ul {
            list-style: none;
        }
        
        li {
            padding: 12px 0;
            font-size: 1.05rem;
            border-bottom: 1px solid #27272a;
        }
        
        li:last-child {
            border-bottom: none;
        }
        
        .highlight {
            color: var(--primary-green);
            font-weight: 600;
        }
        
        footer {
            text-align: center;
            padding-top: 60px;
            color: #52525b;
            font-size: 0.95rem;
            border-top: 1px solid #27272a;
        }
        
        .badge {
            display: inline-block;
            background: rgba(34, 197, 94, 0.1);
            color: var(--primary-green);
            padding: 6px 16px;
            border-radius: 9999px;
            font-size: 0.9rem;
            font-weight: 600;
            margin-top: 20px;
        }
    </style>
</head>
<body>
    <div class="container">
        <header>
            <div class="logo-container">
                <!-- Logo placeholder - replace icon.png with actual image if available -->
                <div style="width: 80px; height: 80px; background: linear-gradient(45deg, #22c55e, #86efac); border-radius: 16px; display: flex; align-items: center; justify-content: center; font-size: 2.5rem; font-weight: bold; color: #0a0a0a;">
                    GL
                </div>
                <h1 class="logo-text">
                    <span class="goorac">Goorac</span> 
                    <span class="learn">Learn</span>
                </h1>
            </div>
            <p class="tagline">Official Professional Learning Platform • Goorac Corporation</p>
            <div class="badge">PRIVATE REPOSITORY</div>
        </header>

        <div class="hero">
            <h1>Empowering Excellence Through Education</h1>
            <p><strong>Goorac Learn</strong> is the official learning platform provided by <strong>Goorac Corporation</strong>. This private repository serves as the central hub for managing, developing, and maintaining our professional certificate course materials and platform infrastructure.</p>
        </div>

        <div class="section">
            <h2>About the Platform</h2>
            <p>Goorac Learn is designed to empower professionals and students by providing high-quality, industry-relevant certification courses. Our platform focuses on practical skills, rigorous assessment, and recognized credentials to help learners advance in their careers.</p>
        </div>

        <div class="section">
            <h2>Access Policy</h2>
            <div class="policy-card">
                <p><strong>This is a private repository</strong> managed exclusively by Goorac Corporation.</p>
                <ul>
                    <li><span class="highlight">Authorized Personnel Only:</span> Access is restricted to authorized employees, contractors, and approved educational partners.</li>
                    <li><span class="highlight">Confidentiality:</span> All source code, curriculum materials, and intellectual property are proprietary to Goorac Corporation. Unauthorized distribution, reproduction, or modification is strictly prohibited.</li>
                </ul>
            </div>
        </div>

        <div class="section">
            <h2>Repository Structure</h2>
            <ul>
                <li><strong>/courses</strong> — Course content, syllabus documentation, and learning modules.</li>
                <li><strong>/assets</strong> — Media files, branding elements, and course materials.</li>
                <li><strong>/src</strong> — Platform source code and infrastructure scripts.</li>
                <li><strong>/docs</strong> — Internal documentation, style guides, and operational procedures.</li>
            </ul>
        </div>

        <footer>
            <p>© 2026 Goorac Corporation. All Rights Reserved.</p>
            <p style="margin-top: 12px; font-size: 0.85rem;">Professional Development • Industry Certification • Career Advancement</p>
        </footer>
    </div>
</body>
</html>
