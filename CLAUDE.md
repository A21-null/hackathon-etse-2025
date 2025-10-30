# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Repository Purpose

This is the working repository for **equipo-3** in a hackathon. The repository currently contains Claude Code setup scripts but is intended for hackathon project development.

## Hackathon Constraints

- **Budget**: $40 USD API usage limit
- **Duration**: 8 hours
- **Usage monitoring**: Real-time tracking enabled

## Setup Commands

The repository includes setup scripts for configuring Claude Code:

**Mac/Linux:**
```bash
chmod +x setup.sh
./setup.sh
```

**Windows:**
- Run `setup.bat` (double-click), or
- Run `setup.ps1` with PowerShell: `powershell -ExecutionPolicy Bypass -File .\setup.ps1`

**Cleanup (post-hackathon):**
```bash
./cleanup.sh  # Mac/Linux
cleanup.bat   # Windows
```

## Development Guidelines

Given the budget and time constraints:

1. **Be efficient with prompts**: Clear, specific requests minimize iterations and token usage
2. **Plan architecture first**: Design before implementing to avoid costly refactoring
3. **Review before iterating**: Verify code correctness before requesting changes
4. **Batch related changes**: Group related modifications to reduce context switching

## Project Structure

Currently, this is an empty project repository. As the hackathon project develops, the codebase structure will emerge based on the team's chosen technology stack and application architecture.
