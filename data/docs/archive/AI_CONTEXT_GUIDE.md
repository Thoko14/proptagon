# AI Context Guide - PropBase Development

## 🎯 **For AI Assistants - Essential Context**

### **When Starting a New Session**
Always reference these files to understand the project:

```markdown
Please review the current state of the project using:
- `data/docs/CONSOLIDATED_GROW_SPEC.md` - Complete Grow module specification with all epics
- `data/docs/MISSING_FUNCTIONALITY_AND_TODOS.md` - What's missing and current TODO status
- `data/docs/AI_CONTEXT_GUIDE.md` - This document with preservation rules and guidelines
- `data/docs/TODO_PRESERVATION_LIST.json` - Current TODO status snapshot
```

### **Before Making Any Changes**
Ask the AI to run the preservation script first:

```markdown
Before we make any changes, please:
1. Run `node scripts/preserve-todos.js --list` to see current TODOs
2. Check if any planned functionality might be affected
3. Ensure we don't accidentally delete required features
4. Review the preservation guidelines in this document
```

## 🏗️ **Project Overview & Architecture**

### **What is PropBase?**
PropBase is a comprehensive property investment platform designed to help users discover, analyze, and invest in real estate opportunities across Australia. The platform combines advanced data analytics, interactive mapping, and intelligent scoring algorithms.

### **Project Structure**
```
PropBase/
├── platform/           # Main web application (React + TypeScript)
├── modules/           # Feature-specific modules
│   ├── grow/         # Property growth analysis module (PRIMARY FOCUS)
│   ├── invest/       # Investment planning module
│   ├── manage/       # Property management module
│   ├── operate/      # Property operations module
│   └── sell/         # Property sales module
├── shared/           # Common utilities and types
├── infrastructure/   # AWS CDK deployment
└── data/docs/        # Project documentation and specifications
```

### **Technology Stack**
- **Frontend**: React 18, TypeScript, Tailwind CSS, Zustand, Mapbox GL JS
- **Backend**: FastAPI (Python), Pydantic, NumPy
- **Infrastructure**: AWS CDK, S3, Lambda, RDS
- **State Management**: Zustand with persistence
- **Mapping**: Mapbox GL JS for interactive maps

## 🛡️ **Critical Preservation Rules**

### ✅ **DO NOT DELETE (Essential Functionality)**
- **Functions marked with `// TODO: Implement`** - These are required features
- **Components with placeholder implementations** - These are part of the core UI
- **Hooks with incomplete functionality** - These provide essential state management
- **API endpoints returning mock data** - These are placeholders for real data sources
- **Any code marked with `FUTURE:` comments** - These are planned enhancements
- **Any component that has placeholder implementations** - These are part of the core UI
- **Any hook that has incomplete functionality** - These provide essential state management

### ❌ **SAFE TO REMOVE (Only These)**
- **Unused imports and variables** - Only if they have no TODO markers
- **Duplicate implementations** - Only if the original is preserved
- **Dead code without TODO markers** - Only if it's truly unused

### 📝 **FUTURE IMPLEMENTATION NOTES**
- All TODO comments should be preserved and expanded with FUTURE notes
- Mock data should be replaced with real API calls
- Placeholder functions should be implemented with proper error handling
- UI components should be enhanced with real functionality

## 📋 **Critical Files to Preserve**

### **Frontend Core Files (Grow Module)**
```
modules/grow/frontend/components/GrowMap.tsx          # Interactive map component
modules/grow/frontend/components/GrowTopBar.tsx       # Top navigation and search
modules/grow/frontend/components/PropertiesFab.tsx    # Property discovery FAB
modules/grow/frontend/components/SuburbToolkit.tsx    # Suburb information panel
modules/grow/frontend/components/SuburbStrategyView.tsx # Strategy configuration
modules/grow/frontend/components/SuburbListView.tsx   # Suburb ranking table
modules/grow/frontend/components/PropertyFilterView.tsx # Property search filters
modules/grow/frontend/components/PropertiesView.tsx   # Property listing grid
modules/grow/frontend/components/PropertyView.tsx     # Property detail view
modules/grow/frontend/components/CompareView.tsx      # Comparison interface
modules/grow/frontend/store/growStore.ts              # State management
```

### **Backend Core Files (Grow Module)**
```
modules/grow/backend/data/fetch.py                    # Data fetching and API integration
modules/grow/backend/scoring/logic/scoring_algorithms.py # Scoring algorithms
modules/grow/backend/scoring/main.py                  # Main scoring endpoint
modules/grow/backend/scoring/logic/weights.py         # Scoring weights and configuration
```

### **Platform Files**
```
platform/src/pages/GrowPage.tsx                       # Main Grow page component
platform/src/App.tsx                                  # Main application component
platform/src/main.tsx                                 # Application entry point
```

## 🎯 **Current Implementation Status**

### ✅ **Completed Features**
- **Map Interactions**: Hover highlighting, click tooltips, suburb selection
- **Search System**: Suburb search with autocomplete, state-aware filtering, geocoding fallback
- **UI Components**: Chip layout, text overflow handling, visual design
- **Performance**: Optimized hover updates (60fps), search debouncing, memory management
- **Strategy Management**: Strategy configuration with KPI sliders and preset management
- **School Catchments MVP**: FAB, sidebar with filtering, VIC year-level support, localStorage persistence ⚠️ **NEEDS TESTING**

### 🔄 **Partially Implemented**
- **Property Data Integration**: Basic structure exists, needs real API connections
- **Compare Functionality**: UI components exist, needs item management features
- **Property Management**: Basic structure exists, needs save/compare features
- **Suburb Navigation**: `zoomToSuburb` function works for search, needs integration with suburb list

### 🆕 **Recently Implemented (Needs Testing)**
- **School Catchments MVP**: Complete implementation with FAB, sidebar, and complex filtering
  - **Components**: `LayersFab.tsx`, `SchoolCatchmentsSidebar.tsx`, `useSchoolCatchments.ts`
  - **Features**: Global type filters, state accordions, VIC year-level filtering, color legend
  - **Integration**: Map layers, hover interactions, click popups, localStorage persistence
  - **Testing Required**: FAB positioning, filtering logic, mobile responsiveness, data loading

### 📋 **Not Yet Implemented**
- **Epic G**: Error handling, accessibility, performance optimizations
- **Epic H**: User data, alerts, activity tracking
- **Advanced Features**: AI recommendations, real-time updates, internationalization

## 🚨 **High Priority Implementation Areas**

### 1. **Property Data Integration** (Critical)
- **Location**: `modules/grow/frontend/components/PropertiesView.tsx`
- **Missing**: Real property data fetching and display
- **Impact**: Core functionality for property discovery
- **TODO**: `// TODO: Get properties from store/API` (Line 37-38)

### 2. **Map Interaction Enhancement** (Critical)
- **Location**: `modules/grow/frontend/components/GrowMap.tsx`
- **Missing**: Complete suburb navigation from suburb list
- **Impact**: Map interaction and user experience
- **TODO**: Connect SuburbListView "Center" button to `zoomToSuburb` function

### 3. **Compare Functionality** (High Priority)
- **Location**: `modules/grow/frontend/components/CompareView.tsx`
- **Missing**: Item removal and reordering in compare view
- **Impact**: Core comparison feature
- **TODO**: `// TODO: Implement item removal/reordering functionality`

### 4. **Property Management** (High Priority)
- **Location**: `platform/src/pages/GrowPage.tsx`
- **Missing**: Save and compare property functionality
- **Impact**: User engagement and data persistence
- **TODO**: `// TODO: Implement save property functionality` (Line 340)

### 5. **Error Handling & Accessibility** (High Priority)
- **Location**: New components needed
- **Missing**: Toast notifications, error recovery, WCAG compliance
- **Impact**: User experience, accessibility compliance
- **Epic**: G1-G2 (Error Recovery & Accessibility)

## 🔧 **Implementation Guidelines**

### **When Implementing TODOs**

1. **Preserve the TODO comment** - Add implementation below it
2. **Add FUTURE notes** - Document next steps or enhancements
3. **Update documentation** - Reflect changes in relevant docs
4. **Test thoroughly** - Ensure functionality works as expected

### **Example Implementation Pattern**

```typescript
// TODO: Implement save property functionality ✅ IMPLEMENTED
// FUTURE: Add to user favorites/watchlist with persistence
const handleSaveProperty = (propertyId: string) => {
  // Implementation here
  saveToUserFavorites(propertyId);
  showSuccessMessage('Property saved to favorites');
};
```

### **Code Quality Standards**

- **TypeScript**: Use strict typing, avoid `any` types
- **React**: Use functional components with hooks, avoid class components
- **Performance**: Implement proper memoization and optimization
- **Accessibility**: Include ARIA labels and semantic HTML
- **Error Handling**: Implement proper error boundaries and user feedback

## 🚨 **Warning Signs to Watch For**

### **Red Flags During Development**
- **Large number of TODO deletions** - Review carefully
- **Removal of placeholder functions** - Check if they're needed
- **Deletion of mock data** - Ensure real data is available
- **Removal of component props** - Verify they're not used elsewhere
- **Deletion of components with TODO markers** - These are required features

### **Safe Development Indicators**
- **Only unused imports removed** - Safe
- **Duplicate code consolidated** - Safe if original preserved
- **Dead code removal** - Safe if no TODO markers
- **Performance optimizations** - Safe if functionality preserved
- **Adding new features** - Safe if following existing patterns

## 📊 **Current Project Statistics**

- **Total TODOs Tracked**: 131+ items
- **High Priority**: 51 items (Critical Files)
- **Medium Priority**: 25 items (Future Implementations)
- **Low Priority**: 48 items (Documentation and Infrastructure)

### **Recent Achievements** ✅
- **Map Functionality**: ✅ **COMPLETED** - Optimized hover performance, smooth suburb selection
- **Search Functionality**: ✅ **COMPLETED** - Robust suburb search with autocomplete, state-aware filtering
- **Chip Styling**: ✅ **COMPLETED** - Wider chips with improved icon-to-text spacing
- **Performance**: ✅ **COMPLETED** - 60fps hover updates with throttling and caching

## 🛠️ **Tools and Scripts**

### **Preservation Scripts**
```bash
# Generate preservation list
node scripts/preserve-todos.js --generate

# List all TODOs
node scripts/preserve-todos.js --list

# Check for deleted TODOs
node scripts/preserve-todos.js --check
```

### **Git Commands for Safety**
```bash
# Check git history for TODO changes
git log -S "TODO:" --oneline

# See what TODOs were in a specific commit
git show <commit-hash> | grep -A 5 -B 5 "TODO:"

# Check for TODO deletions in recent commits
git log --oneline -p | grep -A 10 -B 10 "TODO:"
```

### **Development Commands**
```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build the project
npm run build

# Run tests
npm test

# Check TypeScript
npm run type-check
```

## 📝 **Documentation Requirements**

### **When Making Changes**
1. **Update TODO comments** - Mark as implemented or update status
2. **Add FUTURE notes** - Document next enhancement steps
3. **Update analysis docs** - Reflect current implementation status
4. **Preserve examples** - Keep code examples for future reference

### **Required Documentation Updates**
- `data/docs/MISSING_FUNCTIONALITY_AND_TODOS.md`
- `data/docs/CONSOLIDATED_GROW_SPEC.md`
- `data/docs/TODO_PRESERVATION_LIST.json`

## 🚀 **Development Roadmap**

### **Phase 1: Core Data Integration (Weeks 1-4)**
1. **Property Data Integration** - Connect to real property APIs
2. **Map Interaction Enhancement** - Complete suburb navigation features
3. **Compare Functionality** - Implement item management features
4. **Property Management** - Add save and compare capabilities

### **Phase 2: Enhanced User Experience (Weeks 5-8)**
1. **Error Handling (Epic G1-G2)** - Toast notifications, error recovery, accessibility
2. **Performance Optimization (Epic G3)** - Virtual scrolling, image optimization
3. **Mobile Experience (Epic G4)** - Touch gestures, responsive enhancements

### **Phase 3: Advanced Features (Weeks 9-12)**
1. **User Data Management (Epic H1-H4)** - Watchlist, alerts, activity tracking
2. **Advanced Search (Epic G6)** - Boolean operators, AI suggestions
3. **Security & Privacy (Epic G10)** - GDPR compliance, enhanced security

### **Phase 4: Production Readiness (Weeks 13-16)**
1. **Analytics & Insights (Epic G9)** - User tracking, market insights
2. **Real-time Features (Epic G7)** - Live updates, notifications
3. **Internationalization (Epic G8)** - Multi-language support

## 🔍 **Quick Reference Commands**

### **For AI Interactions**
```bash
# Show me current TODO status
node scripts/preserve-todos.js --list

# Generate preservation list for AI context
node scripts/preserve-todos.js --generate

# Check for deleted TODOs
node scripts/preserve-todos.js --check
```

### **For Development**
```bash
# Before starting work
node scripts/preserve-todos.js --generate

# After making changes
npm run build
node scripts/preserve-todos.js --generate
```

## 📞 **Emergency Recovery**

### **If Critical Functionality is Deleted**
```bash
# Check git history for TODO changes
git log -S "TODO:" --oneline

# See what TODOs were in a specific commit
git show <commit-hash> | grep -A 5 -B 5 "TODO:"

# Regenerate preservation list
node scripts/preserve-todos.js --generate
```

### **Recovery Steps**
1. **Check git history** - Identify when functionality was removed
2. **Restore from backup** - Use git revert or checkout
3. **Regenerate preservation list** - Update TODO tracking
4. **Update documentation** - Reflect the recovery

## 🎯 **Success Metrics**

### **Preservation Success Indicators**
- ✅ No critical TODO items accidentally deleted
- ✅ All placeholder functions preserved or properly implemented
- ✅ Mock data replaced with real implementations
- ✅ Documentation updated to reflect current status
- ✅ Build passes without errors

### **Implementation Success Indicators**
- ✅ Core functionality working as expected
- ✅ User experience improved
- ✅ Performance maintained or improved
- ✅ Code quality enhanced
- ✅ Tests passing

## 🏁 **Conclusion**

The current implementation provides a solid foundation with all core UI components and state management in place. The missing functionality is primarily related to data integration and advanced features.

**Key Principle**: When in doubt, preserve rather than delete. It's better to keep placeholder functionality than to accidentally remove essential features.

**Remember**: Every TODO comment represents planned functionality that users expect. Treat them as requirements, not suggestions.

This guide ensures that AI assistants can work safely and effectively on the PropBase project while preserving all planned functionality and following established development patterns.

---

## 📋 **Quick Start for AI Assistants**

Simply reference this document:

```markdown
Please review `data/docs/AI_CONTEXT_GUIDE.md` for:
- Current project status and preservation rules
- How to use the TODO preservation system
- Critical files that must be protected
- Implementation guidelines and best practices
- Development roadmap and priorities
```
