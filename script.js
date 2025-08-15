const { DateTime } = luxon;

// 常用时区
const commonTimeZones = [
  { tz: "America/Los_Angeles", label: "Pacific Time (洛杉矶, 西雅图)" },
  { tz: "America/New_York", label: "Eastern Time (纽约, 华盛顿)" },
  { tz: "Europe/London", label: "London Time (伦敦)" },
  { tz: "Europe/Paris", label: "Central Europe Time (巴黎, 柏林)" },
  { tz: "Asia/Shanghai", label: "China Standard Time (北京, 上海)" },
  { tz: "Asia/Tokyo", label: "Japan Standard Time (东京)" },
  { tz: "Australia/Sydney", label: "Sydney Time (悉尼)" }
];
const allTimeZones = Intl.supportedValuesOf("timeZone");

function populateTimeZones(select) {
  commonTimeZones.forEach(item => {
    const opt = document.createElement("option");
    opt.value = item.tz;
    opt.textContent = "⭐ " + item.label;
    select.appendChild(opt);
  });
  const sep = document.createElement("option");
  sep.disabled = true;
  sep.textContent = "------------------";
  select.appendChild(sep);
  allTimeZones
    .filter(tz => !commonTimeZones.some(c => c.tz === tz))
    .forEach(tz => {
      const opt = document.createElement("option");
      opt.value = tz;
      opt.textContent = tz;
      select.appendChild(opt);
    });
}

populateTimeZones(document.getElementById("interviewerTZ"));
populateTimeZones(document.getElementById("candidateTZ"));

document.getElementById("interviewerTZ").value = Intl.DateTimeFormat().resolvedOptions().timeZone;
document.getElementById("candidateTZ").value = Intl.DateTimeFormat().resolvedOptions().timeZone;

function setNow() {
  const now = DateTime.now().toFormat("yyyy-LL-dd'T'HH:mm");
  document.getElementById("interviewTime").value = now;
}
setNow();
document.getElementById("nowBtn").addEventListener("click", setNow);

let lastConverted = null;

document.getElementById("convertBtn").addEventListener("click", () => {
  const interviewTime = document.getElementById("interviewTime").value;
  const interviewerTZ = document.getElementById("interviewerTZ").value;
  const candidateTZ = document.getElementById("candidateTZ").value;

  if (!interviewTime) {
    alert("请输入面试时间");
    return;
  }

  const dt = DateTime.fromISO(interviewTime, { zone: interviewerTZ });
  const candidateTime = dt.setZone(candidateTZ);

  const diffHours = (candidateTime.offset - dt.offset) / 60;
  const diffText = diffHours === 0 
    ? "两地时间相同"
    : `目标时区比原时区 ${diffHours > 0 ? "快" : "慢"} ${Math.abs(diffHours)} 小时`;

  document.getElementById("result").innerHTML = `
    <div class="main-time">面试者本地时间: ${candidateTime.toFormat("yyyy-MM-dd HH:mm")}</div>
    <div class="time-diff">${diffText}</div>
  `;
  document.getElementById("result").classList.add("show");

  lastConverted = { start: candidateTime, summary: "面试提醒" };

  document.getElementById("downloadICS").classList.remove("hidden");
  document.getElementById("copyBtn").classList.remove("hidden");
});

// 下载日历文件
document.getElementById("downloadICS").addEventListener("click", () => {
  if (!lastConverted) return;
  
  const dtStart = lastConverted.start.toUTC().
