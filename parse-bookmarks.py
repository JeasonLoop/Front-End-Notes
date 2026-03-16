import re
from pathlib import Path

# 读取书签文件
file_path = r'g:\Desktop\bookmarks_2026_3_16.html'
with open(file_path, 'r', encoding='utf-8') as f:
    content = f.read()

folders = {}
folder_stack = []

lines = content.split('\n')

for line in lines:
    # 匹配文件夹标题 <H3>xxx</H3>
    h3_match = re.search(r'<H3[^>]*>([^<]+)</H3>', line, re.IGNORECASE)
    if h3_match:
        folder_name = h3_match.group(1).strip()
        folder_stack.append(folder_name)
        continue

    # 匹配书签 <A HREF="..." ...>xxx</A>
    a_match = re.search(r'<A\s+[^>]*HREF="([^"]+)"[^>]*>([^<]+)</A>', line, re.IGNORECASE)
    if a_match:
        url = a_match.group(1).strip()
        title = a_match.group(2).strip()

        # 判断当前文件夹路径
        if folder_stack:
            folder_name = folder_stack[-1]
        else:
            folder_name = "根目录"

        if folder_name not in folders:
            folders[folder_name] = []
        folders[folder_name].append((title, url))

    # 遇到 </DL> 退出当前文件夹
    if '</DL>' in line:
        if folder_stack:
            folder_stack.pop()

# 输出 markdown
output = "# 网址书签收集\n\n> 从浏览器书签导出整理，按原文件夹分类保存。\n\n"

# 排序输出
for folder_name in sorted(folders.keys()):
    items = folders[folder_name]
    if len(items) == 0:
        continue
    # 用户说"除了工作相关的书签"，这里我们保留所有，工作相关会放在分类里，用户可以后续删
    output += f"## {folder_name}\n\n"
    # 按标题排序
    for title, url in sorted(items, key=lambda x: x[0].lower()):
        output += f"- [{title}]({url})\n"
    output += "\n"

# 统计
total = sum(len(items) for items in folders.values())
output += f"---\n\n**总计 {total} 个书签**，分类 {len(folders)} 个\n"

# 保存到开发经验文件夹
output_path = r'G:\Desktop\workfiles\Front-End-Notes\开发经验\网址书签收集.md'
with open(output_path, 'w', encoding='utf-8') as f:
    f.write(output)

print("Done: " + output_path)
print("  Total " + str(total) + " bookmarks")
print("  " + str(len(folders)) + " categories")
