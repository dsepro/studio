
"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";

interface UserManualModalProps {
  isOpen: boolean;
  onClose: () => void;
  language: string;
}

export function UserManualModal({ isOpen, onClose, language }: UserManualModalProps) {
  if (!isOpen) return null;

  const T = {
    modalTitle: language === 'zh' ? '用户手册' : 'User Manual',
    modalDescription: language === 'zh' ? '欢迎使用考试信息板。这是一个快速指南：' : "Welcome to the Exam Info Board. Here's a quick guide:",
    overviewTitle: language === 'zh' ? '概述' : 'Overview',
    overviewText: language === 'zh' ? '此应用程序可帮助您记录考试详细信息并在考试期间有效管理时间。' : 'This application helps you keep track of exam details and manage your time effectively during an exam.',
    headerBarTitle: language === 'zh' ? '顶部导航栏' : 'Header Bar',
    headerBarItems: [
      language === 'zh' ? '<strong>时钟:</strong> 显示当前系统时间。' : '<strong>Clock:</strong> Displays the current system time.',
      language === 'zh' ? '<strong>主题切换 (太阳/月亮/笔记本电脑图标):</strong> 在浅色、深色和系统主题之间循环切换。' : '<strong>Theme Toggle (Sun/Moon/Laptop icon):</strong> Cycle through light, dark, and system theme.',
      language === 'zh' ? '<strong>语言切换 (中/EN 图标):</strong> 切换显示语言 (中文/英文)。' : '<strong>Language Toggle (中/EN icon):</strong> Toggle display language (Chinese/English).',
      language === 'zh' ? '<strong>全屏切换 (展开/收缩图标):</strong> 进入或退出全屏模式。' : '<strong>Fullscreen Toggle (Expand/Shrink icon):</strong> Enter or exit fullscreen mode.',
      language === 'zh' ? '<strong>用户手册 (书本图标):</strong> 打开此指南。' : '<strong>User Manual (Book icon):</strong> Opens this guide.',
      language === 'zh' ? '<strong>字号调整 (字体图标):</strong> 点击打开一个弹出框，使用滑块调整应用的基础字号。' : '<strong>Font Size (Font icon):</strong> Click to open a popover with a slider to adjust the application\'s base font size.',
      language === 'zh' ? '<strong>考试设置 (设置图标):</strong> 打开考试配置模式，您可以在其中手动输入考试详细信息或从预设列表中选择。' : '<strong>Exam Setup (Settings icon):</strong> Opens the exam configuration modal where you can manually enter exam details or select from a list of presets.',
      language === 'zh' ? '<strong>安装应用 (下载图标):</strong> 此应用是一个渐进式网络应用 (PWA)。点击此按钮会提示信息，您可以通常通过浏览器的菜单选项（例如，“安装应用”或“添加到主屏幕”）将其安装到您的设备上，以便离线使用并获得类似原生应用的体验。' : '<strong>Install App (Download icon):</strong> This app is a Progressive Web App (PWA). Clicking this gives info, and you can typically install it to your device via your browser\'s menu options (e.g., "Install App" or "Add to Home Screen") for offline use and a native-app-like experience.',
    ],
    examInfoCardTitle: language === 'zh' ? '考试信息卡片' : 'Exam Information Card',
    examInfoCardText: language === 'zh' ? '显示当前考试的详细信息，例如名称、代码、科目、允许时间和说明。这些信息可以通过“考试设置”进行配置或从预设中选择。' : 'Displays details about the current exam, such as title, code, subject, time allowed, and instructions. These can be configured via "Exam Setup" or chosen from a preset.',
    timerCardTitle: language === 'zh' ? '考试计时器卡片' : 'Exam Timer Card',
    timerCardItems: [
      language === 'zh' ? '<strong>计时器显示:</strong> 以 HH:MM:SS 格式显示剩余时间。剩余时间少于或等于5分钟时变为红色。如果计时器未运行，您可以点击时间显示直接编辑剩余时间。' : '<strong>Timer Display:</strong> Shows remaining time in HH:MM:SS format. Turns red when 5 minutes or less remain. If the timer is not running, you can click the time display to edit it directly.',
      language === 'zh' ? '<strong>进度条:</strong> 已用时间的可视化表示。' : '<strong>Progress Bar:</strong> Visual representation of time elapsed.',
      language === 'zh' ? '<strong>开始/停止/重置:</strong> 控制计时器。重置操作是即时的，没有确认提示。' : '<strong>Start/Stop/Reset:</strong> Control the timer. Reset is immediate without confirmation.',
      language === 'zh' ? '<strong>调整当前时间:</strong> 用于增加或减少当前倒计时时间的按钮 (+/- 5分钟, 1分钟, 30秒)。这些按钮在计时器停止时可用。' : '<strong>Adjust Current Time:</strong> Buttons to add or subtract time from the current countdown (+/- 5m, 1m, 30s). These are available when the timer is stopped.',
    ],
    dataPersistenceTitle: language === 'zh' ? '数据持久化' : 'Data Persistence',
    dataPersistenceText: language === 'zh' ? '计时器设置（初始时长、当前剩余时间、运行状态）、考试详细信息和语言偏好都保存在浏览器的本地存储中。这意味着即使您关闭浏览器标签或刷新页面，您的设置也将保留。' : 'Timer settings (initial duration, current time left, running state), exam details, and language preference are saved in your browser\'s local storage. This means your settings will persist even if you close the browser tab or refresh the page.',
    tipsTitle: language === 'zh' ? '提示' : 'Tips',
    tipsItems: [
      language === 'zh' ? '使用全屏模式以获得无干扰的环境。' : 'Use fullscreen mode for a distraction-free environment.',
      language === 'zh' ? '调整字体大小以获得舒适的阅读体验。' : 'Adjust font size for comfort.',
      language === 'zh' ? '在开始前通过“考试设置”设置好考试详细信息或选择一个预设。' : 'Set up exam details via "Exam Setup" or choose a preset before starting.',
      language === 'zh' ? '如果计时器未运行，可以直接点击时间显示来快速修改剩余时间。' : 'Quickly modify the remaining time by clicking on the time display itself if the timer isn\'t running.',
    ],
    closeButton: language === 'zh' ? '关闭' : 'Close',
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle className="text-2xl">{T.modalTitle}</DialogTitle>
          <DialogDescription>
            {T.modalDescription}
          </DialogDescription>
        </DialogHeader>
        <ScrollArea className="h-[60vh] p-1 pr-4">
          <div className="space-y-4 text-sm text-muted-foreground pr-2">
            <section>
              <h3 className="font-semibold text-lg text-foreground mb-2">{T.overviewTitle}</h3>
              <p dangerouslySetInnerHTML={{ __html: T.overviewText }} />
            </section>
            <section>
              <h3 className="font-semibold text-lg text-foreground mb-2">{T.headerBarTitle}</h3>
              <ul className="list-disc list-inside space-y-1">
                {T.headerBarItems.map((item, index) => <li key={index} dangerouslySetInnerHTML={{ __html: item }} />)}
              </ul>
            </section>
            <section>
              <h3 className="font-semibold text-lg text-foreground mb-2">{T.examInfoCardTitle}</h3>
              <p dangerouslySetInnerHTML={{ __html: T.examInfoCardText }} />
            </section>
            <section>
              <h3 className="font-semibold text-lg text-foreground mb-2">{T.timerCardTitle}</h3>
              <ul className="list-disc list-inside space-y-1">
                 {T.timerCardItems.map((item, index) => <li key={index} dangerouslySetInnerHTML={{ __html: item }} />)}
              </ul>
            </section>
             <section>
              <h3 className="font-semibold text-lg text-foreground mb-2">{T.dataPersistenceTitle}</h3>
              <p dangerouslySetInnerHTML={{ __html: T.dataPersistenceText }} />
            </section>
            <section>
              <h3 className="font-semibold text-lg text-foreground mb-2">{T.tipsTitle}</h3>
              <ul className="list-disc list-inside space-y-1">
                {T.tipsItems.map((item, index) => <li key={index} dangerouslySetInnerHTML={{ __html: item }} />)}
              </ul>
            </section>
          </div>
        </ScrollArea>
        <DialogFooter>
          <Button onClick={onClose}>{T.closeButton}</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
