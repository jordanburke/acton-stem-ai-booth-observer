import { firefox } from "playwright"

async function diagnose() {
  const browser = await firefox.launch({ headless: true })
  const context = await browser.newContext({
    viewport: { width: 1920, height: 1080 },
  })
  const page = await context.newPage()

  console.log("=== NAVIGATING TO PAGE ===")
  await page.goto("http://localhost:3000/", { waitUntil: "networkidle" })
  await page.waitForTimeout(2000)

  console.log("\n=== TAKING SCREENSHOTS ===")
  await page.screenshot({ path: "/tmp/full-page.png", fullPage: true })
  console.log("Screenshot saved to /tmp/full-page.png")

  console.log("\n=== CHECKING MANTINE DARK MODE ATTRIBUTES ===")
  const htmlDataTheme = await page.getAttribute("html", "data-mantine-color-scheme")
  const bodyDataTheme = await page.getAttribute("body", "data-mantine-color-scheme")
  console.log("html[data-mantine-color-scheme]:", htmlDataTheme || "NOT SET")
  console.log("body[data-mantine-color-scheme]:", bodyDataTheme || "NOT SET")

  console.log("\n=== CHECKING MANTINE CSS VARIABLES ===")
  const cssVars = await page.evaluate(() => {
    const computedStyle = getComputedStyle(document.documentElement)
    return {
      "mantine-dark-0": computedStyle.getPropertyValue("--mantine-color-dark-0"),
      "mantine-dark-6": computedStyle.getPropertyValue("--mantine-color-dark-6"),
      "mantine-dark-7": computedStyle.getPropertyValue("--mantine-color-dark-7"),
      "bg-primary": computedStyle.getPropertyValue("--bg-primary"),
      "bg-secondary": computedStyle.getPropertyValue("--bg-secondary"),
    }
  })
  console.log("CSS Variables:", JSON.stringify(cssVars, null, 2))

  console.log("\n=== INSPECTING APPSHELL BACKGROUND ===")
  const appShellBg = await page.evaluate(() => {
    const appShell = document.querySelector("main") || document.querySelector('[class*="AppShell"]')
    if (!appShell) return { error: "AppShell not found" }
    const computed = getComputedStyle(appShell)
    return {
      tag: appShell.tagName,
      backgroundColor: computed.backgroundColor,
      color: computed.color,
    }
  })
  console.log("AppShell:", JSON.stringify(appShellBg, null, 2))

  console.log("\n=== INSPECTING PAPER COMPONENTS ===")
  const paperComponents = await page.evaluate(() => {
    const papers = Array.from(document.querySelectorAll('[class*="Paper"]'))
    return papers.slice(0, 4).map((paper, idx) => {
      const computed = getComputedStyle(paper)
      const text = paper.textContent.substring(0, 30).trim()
      return {
        index: idx,
        text: text,
        backgroundColor: computed.backgroundColor,
        borderColor: computed.borderColor,
      }
    })
  })
  console.log("Paper Components:", JSON.stringify(paperComponents, null, 2))

  console.log("\n=== INSPECTING PLAY/PAUSE BUTTON ===")
  const buttonInfo = await page.evaluate(() => {
    const buttons = Array.from(document.querySelectorAll("button"))
    const playButton = buttons.find((btn) => btn.textContent.includes("Start") || btn.textContent.includes("Pause"))

    if (!playButton) {
      return { error: "Button not found", totalButtons: buttons.length }
    }

    const computed = getComputedStyle(playButton)
    return {
      text: playButton.textContent.trim(),
      backgroundColor: computed.backgroundColor,
      color: computed.color,
      visibility: computed.visibility,
      opacity: computed.opacity,
    }
  })
  console.log("Play/Pause Button:", JSON.stringify(buttonInfo, null, 2))

  console.log("\n=== BODY STYLES ===")
  const bodyStyles = await page.evaluate(() => {
    const computed = getComputedStyle(document.body)
    return {
      backgroundColor: computed.backgroundColor,
      color: computed.color,
    }
  })
  console.log("Body:", JSON.stringify(bodyStyles, null, 2))

  await browser.close()
  console.log("\n=== DIAGNOSIS COMPLETE ===")
}

diagnose().catch(console.error)
