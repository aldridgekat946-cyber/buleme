
import { GoogleGenAI } from "@google/genai";
import { DivinationResult } from "./types";

const systemInstruction = `你是一位现代、专业、说话直白的周易预测专家。
你的任务是为用户解读“卜了么”起出的卦象，给出最真实的结论。

## 解读核心准则：
1. **去玄学化**：不要堆砌普通人听不懂的术语（如“财官双美”、“腾蛇入水”）。如果一定要提到术语，请立即在后面用现代白话解释。
2. **客观真实**：如果是凶卦，直接指出风险和不顺，绝不粉饰太平。吉卦则指出机遇。
3. **大白话解析**：将复杂的生克关系（月破、日克、动变）转化为普通人能听懂的现实状况。
4. **具象化建议**：给出的建议要具体，比如“最近不要投资”、“适合主动沟通”、“防范竞争对手”。

## 输出结构要求：
1. **最终定性**：直接告诉用户这事是吉、是凶、还是平。
2. **大白话局势**：用两三句话讲清楚这件事现在的真实状态，别绕弯子。
3. **关键点提醒**：指出卦象里最致命或最有利的一个关键因素。
4. **避坑指南/行动建议**：给2条非常具体的现代生活操作建议。`;

const buildPrompt = (data: DivinationResult) => `
### 用户问题
“${data.meta.question}”

### 卦象核心参数
- **起卦时间**：${data.meta.lunar_date}（月建：${data.meta.month_branch}，日辰：${data.meta.day_branch}）
- **本卦**：${data.hexagram.primary.name}
- **变卦**：${data.hexagram.transformed?.name || '无变爻'}
- **排盘详情**：
${data.hexagram.primary.lines.map(l => {
  let lineDesc = `[${l.pos}爻] ${l.relation}${l.stem_branch} - ${l.beast}${l.is_shi ? ' (代表你/世爻)' : ''}${l.is_ying ? ' (代表对方或目标/应爻)' : ''}`;
  if (l.changing_to) {
    lineDesc += ` -> 动化${l.changing_to.relation}${l.changing_to.stem_branch}`;
  }
  return lineDesc;
}).join('\n')}

请以此逻辑，给出最直白、最真实、不虚美不隐恶的解读报告。`;

export const getAIInterpretationStream = async function* (data: DivinationResult, retries = 2): AsyncGenerator<string, void, unknown> {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const prompt = buildPrompt(data);

  let attempt = 0;
  while (attempt <= retries) {
    try {
      const responseStream = await ai.models.generateContentStream({
        model: 'gemini-3.1-pro-preview',
        contents: prompt,
        config: {
          systemInstruction: systemInstruction,
          temperature: 0.7,
          topP: 0.9,
        }
      });
      
      for await (const chunk of responseStream) {
        if (chunk.text) {
          yield chunk.text;
        }
      }
      return; // Success, exit the generator
    } catch (error) {
      attempt++;
      console.error(`Gemini API Error (Attempt ${attempt}):`, error);
      if (attempt > retries) {
        yield "\n\n[系统提示：解析时网络波动，请检查您的网络并稍后再试。]";
      } else {
        // Wait before retrying (exponential backoff)
        await new Promise(resolve => setTimeout(resolve, 1000 * Math.pow(2, attempt - 1)));
      }
    }
  }
};
